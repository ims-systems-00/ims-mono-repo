const cc = require("../../services/cc");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createCcParameter = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const ccParameter = await ccParameterService.createCcParameter({
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "cc parameter created successfully.",
      ccParameter,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCcParameter = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const { id } = req.params;
    const ccParameter = await ccParameterService.getCcParameter({
      _id: id,
    });
    res.status(StatusCodes.OK).json({
      message: "cc parameter retrived.",
      ccParameter,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCcParameter = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const { id } = req.params;
    const ccParameter = await ccParameterService.updateCcParameter(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "cc parameter info updated.",
      ccParameter,
    });
  } catch (error) {
    next(error);
  }
};

exports.listCcParameters = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await ccParameterService.listCcParameters(query, options);
    return res.status(StatusCodes.OK).json({
      message: "cc parameter retrived.",
      pagination: formatListResponse(results).pagination,
      ccParameters: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveCcParameter = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const ccParameter = await ccParameterService.softRemoveCcParameter(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "cc parameter moved to trash.",
      ccParameter,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreCcParameter = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const ccParameter = await ccParameterService.restoreCcParameter(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "cc parameter restored.",
      ccParameter,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveCcParameter = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const ccParameter = await ccParameterService.hardRemoveCcParameter(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "cc parameter removed.",
      ccParameter,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCcParameterReportingBoundaries = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const { parameterId } = req.params;
    const ccParameterReportingBoundaries =
      await ccParameterService.getCcParameterReportingBoundaries({
        _id: parameterId,
      });
    res.status(StatusCodes.OK).json({
      message: "cc parameter reporting boundaries retrived.",
      ccParameterReportingBoundaries,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCcParameterReportingBoundary = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const { parameterId, id } = req.params;
    const ccParameterReportingBoundary =
      await ccParameterService.updateCcParameterReportingBoundary(id, {
        ...req.body,
        parameterId: parameterId,
      });
    res.status(StatusCodes.OK).json({
      message: "cc parameter reporting boundary info updated.",
      ccParameterReportingBoundary,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCcParameterReportingYears = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const { parameterId } = req.params;
    const ccParameterReportingYears =
      await ccParameterService.getCcParameterReportingYears({
        _id: parameterId,
      });
    res.status(StatusCodes.OK).json({
      message: "cc parameter reporting years retrived.",
      ccParameterReportingYears,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCcParameterReportingYear = async (req, res, next) => {
  let ccParameterService = new cc.CcParameter(req.accessControl);
  try {
    const { parameterId, id } = req.params;
    const ccParameterReportingYear =
      await ccParameterService.updateCcParameterReportingYear(id, {
        ...req.body,
        parameterId: parameterId,
      });
    res.status(StatusCodes.OK).json({
      message: "cc parameter reporting year info updated.",
      ccParameterReportingYear,
    });
  } catch (error) {
    next(error);
  }
};
