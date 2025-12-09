const cc = require("../../services/cc");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createCcLocation = async (req, res, next) => {
  let ccLocationService = new cc.CcLocation(req.accessControl);
  try {
    const ccLocation = await ccLocationService.createCcLocation({
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "cc location created successfully.",
      ccLocation,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCcLocation = async (req, res, next) => {
  let ccLocationService = new cc.CcLocation(req.accessControl);
  try {
    const { id } = req.params;
    const ccLocation = await ccLocationService.getCcLocation({
      _id: id,
    });
    res.status(StatusCodes.OK).json({
      message: "cc location retrived.",
      ccLocation,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCcLocation = async (req, res, next) => {
  let ccLocationService = new cc.CcLocation(req.accessControl);
  try {
    const { id } = req.params;
    const ccLocation = await ccLocationService.updateCcLocation(id, req.body);
    res.status(StatusCodes.OK).json({
      message: "cc location info updated.",
      ccLocation,
    });
  } catch (error) {
    next(error);
  }
};
exports.listCcLocation = async (req, res, next) => {
  let ccLocationService = new cc.CcLocation(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["locationRef", "address", "descriptionOfActivities"],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await ccLocationService.listCcLocation(query, options);
    return res.status(StatusCodes.OK).json({
      message: "cc location retrived.",
      pagination: formatListResponse(results).pagination,
      ccLocations: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveCcLocation = async (req, res, next) => {
  let ccLocationService = new cc.CcLocation(req.accessControl);
  try {
    const ccLocation = await ccLocationService.softRemoveCcLocation(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "cc location moved to trash.",
      ccLocation,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreCcLocation = async (req, res, next) => {
  let ccLocationService = new cc.CcLocation(req.accessControl);
  try {
    const ccLocation = await ccLocationService.restoreCcLocation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "cc location restored.",
      ccLocation,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveCcLocation = async (req, res, next) => {
  let ccLocationService = new cc.CcLocation(req.accessControl);
  try {
    const ccLocation = await ccLocationService.hardRemoveCcLocation(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "cc location removed.",
      ccLocation,
    });
  } catch (error) {
    next(error);
  }
};
