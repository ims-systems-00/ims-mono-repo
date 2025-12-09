const { trimQuery } = require("../../validations/utils");
const licenseRequested = require("../../services/licenseRequest");
exports.createRequest = async (req, res, next) => {
  let LicenseRequestedManager = new licenseRequested.LicenseRequestedService(
    req.accessControl
  );
  try {
    let request = await LicenseRequestedManager.createRequest({
      ...req.body,
      createdBy: req.accessControl.user,
    });

    res
      .status(200)
      .json({ message: "License request created successfully", request });
  } catch (error) {
    next(error);
  }
};

exports.getRequests = async (req, res, next) => {
  let LicenseRequestedManager = new licenseRequested.LicenseRequestedService(
    req.accessControl
  );
  try {
    // let { groupPolicy, session } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    const options = { page, limit: size, sort };
    let query = {};
    let requests = [];
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (iamPolicy.validateGlobalAccess(groupPolicy)) {
    //   query = {};
    // } else {
    //   query = { group: session.current.group };
    // }
    const result = await LicenseRequestedManager.listRequestsByOrg(
      query,
      options
    );
    // requests = pagination.docs;
    // requests = await Promise.all(
    //   requests.map((request) => LicenseRequest.populateLicenseRequest(request))
    // );
    res.status(200).json({
      message: "Licenses retrived successfully",
      pagination: result.pagination,
      requests: result.requests,
    });
  } catch (error) {
    next(error);
  }
};
exports.getRequest = async (req, res, next) => {
  let LicenseRequestedManager = new licenseRequested.LicenseRequestedService(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let request = await LicenseRequestedManager.getRequest({ _id: id });
    res.status(200).json({ message: "License retrived successfully", request });
  } catch (error) {
    next(error);
  }
};
exports.deleteRequest = async (req, res, next) => {
  let LicenseRequestedManager = new licenseRequested.LicenseRequestedService(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let request = await LicenseRequestedManager.deleteRequest({ _id: id });
    res.status(200).json({ message: "License deleted successfully", request });
  } catch (error) {
    next(error);
  }
};
