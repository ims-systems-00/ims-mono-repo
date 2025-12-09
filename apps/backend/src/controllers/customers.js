const CRMService = require("../services/crm");
const { Filters } = require("../services/utility");
const { IamPolicy } = require("../services/iamPolicy");
const AnalyticsService = require("../services/analytics");
const { StatusCodes } = require("http-status-codes");
exports.initiateCrm = async (req, res) => {
  let crmService = new CRMService(req.accessControl);
  let [initiationError, init] = await crmService.initiateCRM();
  if (initiationError)
    return res
      .status(500)
      .json({ message: "CRM initiation failed.", initiationError });
  return res.status(200).json({ message: "Crm initiated.", init });
};
exports.createCustomer = async (req, res, next) => {
  let crmService = new CRMService(req.accessControl);
  try {
    let validation = { isValid: true, messages: [] };
    if (!validation.isValid)
      return res.status(400).json({ message: "Invalid input" });
    let customer = await crmService.createCustomer({
      ...req.body,
      organization: req.accessControl.user.organizationId,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Customer has been created.", customer });
  } catch (error) {
    next(error);
  }
};
exports.getCustomers = async (req, res, next) => {
  let crmService = new CRMService(req.accessControl);
  try {
    let { session, groupPolicy } = req.accessControl;
    let { page, size, sort } = req.query;
    let filter = new Filters(req, {
      searchFields: ["reference", "name", "email", "serviceProvision"],
    })
      .build()
      .query();
    const options = { page, limit: size, sort };
    let query = { ...filter };
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (!iamPolicy.validateGlobalAccess(groupPolicy))
    //   query = { ...query, group: session.current.group };
    let queryResult = await crmService.getCustomersByOrg(query, options);
    return res.status(200).json({
      message: "Customers retrived successfully.",
      customers: queryResult.customers,
      pagination: queryResult.pagination,
    });
  } catch (error) {
    next(error);
  }
};
exports.getCustomer = async (req, res, next) => {
  let crmService = new CRMService(req.accessControl);
  try {
    let { id } = req.params;
    let customer = await crmService.getCustomer(id);
    return res
      .status(200)
      .json({ message: "Customer retrived successfully.", customer });
  } catch (error) {
    next(error);
  }
};
exports.updateCustomer = async (req, res, next) => {
  let crmService = new CRMService(req.accessControl);
  try {
    let { id } = req.params;
    req.body.updatedBy = req.accessControl.user._id;
    let customer = await crmService.updateCustomer(id, req.body);
    return res
      .status(200)
      .json({ message: "Customer updated successfully.", customer });
  } catch (error) {
    next(error);
  }
};
exports.removeAttchment = async (req, res, next) => {
  let crmService = new CRMService(req.accessControl);
  try {
    let { id, attachment_id } = req.params;
    let customer = await crmService.deleteAttchments(id, attachment_id);
    res
      .status(200)
      .json({ message: "Attachment deleted successfully", customer });
  } catch (error) {
    next(error);
  }
};
exports.deleteCustomer = async (req, res, next) => {
  let crmService = new CRMService(req.accessControl);
  try {
    let { id } = req.params;
    let customer = await crmService.deleteCustomer(id);
    return res
      .status(200)
      .json({ message: "Customer deleted successfully.", customer });
  } catch (error) {
    next(error)
  }
};
exports.getCustomerOverview = async (req, res) => {
  let crmService = new CRMService(req.accessControl);
  try {
    let { id } = req.params;
    let overview = await crmService.getOverview(id);
    return res
      .status(200)
      .json({ message: "Customer overview retrived successfully.", overview });
  } catch (error) {
    next(error);
  }
};
exports.getAccountManagerOverview = async (req, res) => {
  let analyticsService = new AnalyticsService(req.accessControl);
  try {
    let { managerId } = req.params;
    let overview = await analyticsService.analyzeCustomersForManager(managerId);
    return res.status(200).json({
      message: "Account manager overview retrived successfully.",
      overview,
    });
  } catch (error) {
    next(error);
  }
};
