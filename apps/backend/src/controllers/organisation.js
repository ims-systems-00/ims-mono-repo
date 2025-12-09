const { StatusCodes } = require("http-status-codes");
const OrganisationService = require("../services/organisation");
const { Membership } = require("../services/membership");
const {
  ROLES,
} = require("../models/mongodb/schemaTemplates/references/typesAndEnums");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { formatListResponse, Filters } = require("../services/utility");

exports.createOrganisation = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    const organisation = await organisationService.initializeOrganisation(
      req.body
    );
    return res.status(StatusCodes.CREATED).json({
      message: "Organisation created successfully",
      organization: organisation,
    });
  } catch (err) {
    next(err);
  }
};
exports.getOrganisations = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["name"],
    })
      .build()
      .query();
    let query = { ...filter };
    const { organizations, pagination } =
      await organisationService.getOrganisations(query, options);
    res
      .status(StatusCodes.OK)
      .json({ message: "Organisations found", organizations, pagination });
  } catch (err) {
    next(err);
  }
};
exports.listUsers = async (req, res, next) => {
  let membershipService = new Membership(req.accessControl);
  try {
    const results = await membershipService.listMembership({
      organization: req.accessControl.user.organizationId,
    });
    res.status(StatusCodes.OK).json({
      message: "Users retrived",
      users: formatListResponse(results).data.map((m) => ({
        ...m.invitedUserId._doc,
        role: m.role,
      })),
      pagination: formatListResponse(results).pagination,
    });
  } catch (err) {
    next(err);
  }
};
exports.getOrganisation = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    const organization = await organisationService.getOrganisation(
      req.params.id
    );
    res
      .status(StatusCodes.OK)
      .json({ message: "Organisation found", organization });
  } catch (err) {
    next(err);
  }
};
exports.updateOrganisation = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    const updatedOrganization = await organisationService.updateOrganisation(
      req.params.id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "Organisation updated",
      organization: updatedOrganization,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateLogo = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    let { logometadata } = req.body;
    let updatedOrganization = await organisationService.updateLogo(
      req.params.id,
      logometadata
    );
    res.status(StatusCodes.OK).json({
      message: "Organisation updated successfully.",
      organization: updatedOrganization,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateLogoRectangle = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    let { logoRectangleMetadata } = req.body;
    let updatedOrganization = await organisationService.updateLogoRectangle(
      req.params.id,
      logoRectangleMetadata
    );
    res.status(StatusCodes.OK).json({
      message: "Organisation updated successfully.",
      organization: updatedOrganization,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeOrganisation = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    res.json("Ok");
  } catch (err) {
    next(err);
  }
};
exports.getLicenses = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    const licenses = await organisationService.getLicenses(req.params.id);
    res.status(StatusCodes.OK).json({ message: "Successs", licenses });
  } catch (err) {
    next(err);
  }
};
exports.setIncidentResolutionTimes = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    const {
      p1incidentResolutionTime,
      p2incidentResolutionTime,
      p3incidentResolutionTime,
      p4incidentResolutionTime,
    } = req.body;
    await organisationService.setIncidentResolutionTimes(
      req.params.id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "Success",
      data: {
        p1incidentResolutionTime,
        p2incidentResolutionTime,
        p3incidentResolutionTime,
        p4incidentResolutionTime,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.getIncidentResolutionTimes = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    const times = await organisationService.getIncidentResolutionTimes(
      req.params.id
    );
    res.status(StatusCodes.OK).json({
      message: "Success",
      resolutionTime: {
        ...times,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.getSystemDates = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    let systemDate = await organisationService.getSystemDates(req.params.id);
    res.status(StatusCodes.OK).json({ message: "Success", systemDate });
  } catch (err) {
    next(err);
  }
};
exports.updateSystemDates = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    let { start, end } = req.body;
    await organisationService.updateSystemDates(req.params.id, req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: "Success", systemDate: { start, end } });
  } catch (err) {
    next(err);
  }
};
exports.addRreportSubscriber = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    let subscriber = await organisationService.addRreportSubscriber(
      req.params.id,
      req.body
    );
    res.status(StatusCodes.OK).json({ message: "Success", subscriber });
  } catch (err) {
    next(err);
  }
};
exports.getRreportSubscribers = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    let reportSubscriptions = await organisationService.getRreportSubscribers(
      req.params.id
    );
    res.status(StatusCodes.OK).json({
      message: "Success",
      reportSubscriptions,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateRreportSubscriber = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    let { organizationId, subscriberId } = req.params;
    let { name, email, interval } = req.body;
    // logger.info(req.body)
    // let organization = await Organization.findOneAndUpdate({_id:organizationId},{$set:{reportSubscriptions:{name, email,interval}}},{new:true})
    res.status(StatusCodes.OK).json("Subscriber updated");
  } catch (err) {
    next(err);
  }
};
exports.removeRreportSubscriber = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    let { subscription_id } = req.params;
    await organisationService.removeRreportSubscriber(req.params.id, {
      subscription_id,
    });
    res.status(StatusCodes.OK).json({ message: "Successfully removed" });
  } catch (err) {
    next(err);
  }
};
exports.becomeACustomer = async function (req, res, next) {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    const response = await organisationService.becomeACustomer(
      req.params.id,
      req.body
    );
    return res.status(StatusCodes.OK).json({
      message: "Congratulations! Your iMS is now live.",
      organization: response.organization,
      paymentSession: response.paymentSession,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.payWithCard = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    const paymentSession = await organisationService.payWithCard(
      req.accessControl.user.organizationId
    );
    return res.status(StatusCodes.CREATED).json({
      message: "Payment session created successfully",
      paymentSession,
    });
  } catch (err) {
    next(err);
  }
};
exports.getBillingSession = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    const billingSession = await organisationService.getBillingSession(
      req.accessControl.user.organizationId
    );
    return res.status(StatusCodes.CREATED).json({
      message: "Billing session created successfully",
      billingSession,
    });
  } catch (err) {
    next(err);
  }
};

exports.adminAlertOrganisationForPayment = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    await organisationService.alertOrganisationForPayment(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Organisation alerted.",
    });
  } catch (err) {
    next(err);
  }
};
exports.adminReactivateOrganisation = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    await organisationService.reactivateOrganisation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Organisation reactivated",
    });
  } catch (err) {
    next(err);
  }
};
exports.adminBlockOrganisation = async (req, res, next) => {
  let organisationService = new OrganisationService(req.accessControl);
  try {
    await organisationService.blockOrganisation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Organisation blocked.",
    });
  } catch (err) {
    next(err);
  }
};
