const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { stripe } = require("../../config/stripe");
const PaymnetService = require("../../services/payments");
exports.paymentWebhook = async (req, res, next) => {
  const paymentSerive = new PaymnetService();
  try {
    const stripeSignature = req.headers["stripe-signature"];
    let event = req.body;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        stripeSignature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error(err.message, err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case "customer.deleted":
        logger.info("Customer deleted", event.type);
        await paymentSerive.resetOrgPaymentsystem(event.data.object.id);
        break;
      case "customer.subscription.deleted":
        logger.info("Customer subscription deleted", event.type);
        await paymentSerive.unSubscribeOrgWithStripe(
          event.data.object.customer
        );
        break;
      case "customer.subscription.updated":
        logger.info("Customer subscription updated", event.type);
        await paymentSerive.subscribeOrgWithStripe(
          event.data.object.customer,
          event.data.object.id
        );
        break;
      case "checkout.session.completed":
        logger.info("Checkout session completed", event.type);
        break;
      default:
        logger.error(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({
      received: true,
    });
  } catch (error) {
    next(error);
  }
};
