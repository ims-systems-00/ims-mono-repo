const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { stripe } = require("../config/stripe");
const { APIError } = require("../helpers/errors/apiError");
const { models } = require("../models");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
} = require("../models/mongodb/schemaTemplates/references/typesAndEnums");
const SUPPORT_PERCENTAGE = 0.25;
class PaymentService {
  constructor(connection) {
    this.connection = connection;
    this.Organisation = models.organizations(connection);
  }
  async getOrganization(query) {
    const organization = await this.Organisation.findOne({
      ...query,
    });
    if (!organization)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Org not found while processing payment."
      );
    return organization;
  }
  async getCheckoutSessionForOrg(id, licenses) {
    const organization = await this.getOrganization({ _id: id });
    if (organization.paymentSystem.type !== PAYMENT_METHODS.CARD)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Organisation needs to have a card payment type to create a checkout session."
      );
    if (!organization.paymentSystem.information.stripeCustomerId) {
      logger.info(
        "customer id not found for organisation, required to create a stripe customer. creating now..."
      );
      const customer = await stripe.customers.create({
        name: organization.name,
        email: organization.officeEmail,
      });
      organization.paymentSystem.information.stripeCustomerId = customer.id;
      await organization.save();
      logger.info("stripe customer created.");
    }
    const [unitBuPrice, unitSuPrice, unitUPrice] = await Promise.all([
      stripe.prices.retrieve(process.env.STRIPE_BU_PRICE),
      stripe.prices.retrieve(process.env.STRIPE_SA_PRICE),
      stripe.prices.retrieve(process.env.STRIPE_USER_PRICE),
    ]);

    /** calculate support price unit */
    const totalSupportUnit =
      (unitBuPrice.unit_amount / 100) * parseInt(licenses.groups) +
      (unitSuPrice.unit_amount / 100) * parseInt(licenses.superUser) +
      (unitUPrice.unit_amount / 100) * parseInt(licenses.users);

    const lineItems = [];
    if (parseInt(licenses.groups)) {
      lineItems.push({
        price: process.env.STRIPE_BU_PRICE,
        quantity: licenses.groups,
      });
    }
    if (parseInt(licenses.superUser)) {
      lineItems.push({
        price: process.env.STRIPE_SA_PRICE,
        quantity: licenses.superUser,
      });
    }
    if (parseInt(licenses.users)) {
      lineItems.push({
        price: process.env.STRIPE_USER_PRICE,
        quantity: licenses.users,
      });
    }
    if (licenses.complianceTools.length) {
      lineItems.push({
        price: process.env.STRIPE_COMPLIANCE_PRICE,
        quantity: licenses.complianceTools.length,
      });
    }
    if (licenses.additionalModules.length) {
      lineItems.push({
        price: process.env.STRIPE_ADD_MODULE_PRICE,
        quantity: licenses.additionalModules.length,
      });
    }
    lineItems.push({
      price: process.env.STRIPE_SUPPORT_PRICE,
      quantity: Math.ceil(totalSupportUnit * SUPPORT_PERCENTAGE),
    });
    logger.info("creating checkout session...");
    return stripe.checkout.sessions.create({
      success_url: process.env.CLIENT_URL + "/auth/preparation-screen",
      cancel_url: process.env.CLIENT_URL + "/auth/preparation-screen",
      customer: organization.paymentSystem.information.stripeCustomerId,
      metadata: {
        ims_automated_go_live: true,
        org_id: this.connection.user.organizationId,
        org_name: this.connection.user.organizationName,
      },
      line_items: lineItems,
      mode: "subscription",
    });
  }
  async createBillingPortalSessionForOrg(id) {
    const organization = await this.getOrganization({ _id: id });
    if (!organization.paymentSystem.information.stripeCustomerId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Organisation does not have a stripe custommer id."
      );
    return stripe.billingPortal.sessions.create({
      customer: organization.paymentSystem.information.stripeCustomerId,
      return_url: process.env.CLIENT_URL + "/admin/organisation",
    });
  }
  async subscribeOrgWithStripe(customerId, subscriptionId) {
    const organization = await this.getOrganization({
      "paymentSystem.information.stripeCustomerId": customerId,
    });
    organization.paymentSystem.information.stripeSubscriptionId =
      subscriptionId;
    organization.paymentSystem.status = PAYMENT_STATUS.SUBSCRIBED;
    return organization.save();
  }
  async unSubscribeOrgWithStripe(customerId) {
    const organization = await this.getOrganization({
      "paymentSystem.information.stripeCustomerId": customerId,
    });
    organization.paymentSystem.information.stripeSubscriptionId = null;
    organization.paymentSystem.status = PAYMENT_STATUS.UNSUBSCRIBED;
    return organization.save();
  }
  async resetOrgPaymentsystem(customerId) {
    const organization = await this.getOrganization({
      "paymentSystem.information.stripeCustomerId": customerId,
    });
    organization.paymentSystem.status = PAYMENT_STATUS.UNSUBSCRIBED;
    organization.paymentSystem.information.stripeCustomerId = null;
    organization.paymentSystem.information.stripeSubscriptionId = null;
    return organization.save();
  }
  async upgradeSubscriptionWithStripe(subscriptionId, licenses) {
    const organization = await this.getOrganization({
      "paymentSystem.information.stripeSubscriptionId": subscriptionId,
    });
    const { data: subscriptionItems } = await stripe.subscriptionItems.list({
      limit: 4,
      subscription: subscriptionId,
    });
    /** calculate support upgrade */

    let totalSupportUnit = 0;

    if (licenses.groups) {
      const businessUnitSubscriptionItem = subscriptionItems.find(
        (item) => item.price.id === process.env.STRIPE_BU_PRICE
      );
      totalSupportUnit +=
        (businessUnitSubscriptionItem.price.unit_amount / 100) *
        parseInt(licenses.groups);
      await stripe.subscriptionItems.update(businessUnitSubscriptionItem.id, {
        quantity: businessUnitSubscriptionItem.quantity + licenses.groups,
      });
    }
    if (licenses.superUser) {
      const superUserSubscriptionItem = subscriptionItems.find(
        (item) => item.price.id === process.env.STRIPE_SA_PRICE
      );
      totalSupportUnit +=
        (superUserSubscriptionItem.price.unit_amount / 100) *
        parseInt(licenses.superUser);
      await stripe.subscriptionItems.update(superUserSubscriptionItem.id, {
        quantity: superUserSubscriptionItem.quantity + licenses.superUser,
      });
    }
    if (licenses.users) {
      const userSubscriptionItem = subscriptionItems.find(
        (item) => item.price.id === process.env.STRIPE_USER_PRICE
      );
      totalSupportUnit +=
        (userSubscriptionItem.price.unit_amount / 100) *
        parseInt(licenses.users);
      await stripe.subscriptionItems.update(userSubscriptionItem.id, {
        quantity: userSubscriptionItem.quantity + licenses.users,
      });
    }
    const supportSubscriptionItem = subscriptionItems.find(
      (item) => item.price.id === process.env.STRIPE_SUPPORT_PRICE
    );
    await stripe.subscriptionItems.update(supportSubscriptionItem.id, {
      quantity:
        supportSubscriptionItem.quantity +
        Math.ceil(totalSupportUnit * SUPPORT_PERCENTAGE),
    });
    if (licenses.complianceTools.length) {
      await stripe.invoiceItems.create({
        customer: organization.paymentSystem.information.stripeCustomerId,
        subscription: subscriptionId,
        price: process.env.STRIPE_COMPLIANCE_PRICE,
        quantity: licenses.complianceTools.length,
      });
    }
    if (licenses.additionalModules.length) {
      await stripe.invoiceItems.create({
        customer: organization.paymentSystem.information.stripeCustomerId,
        subscription: subscriptionId,
        price: process.env.STRIPE_ADD_MODULE_PRICE,
        quantity: licenses.additionalModules.length,
      });
    }
  }
}
module.exports = PaymentService;
