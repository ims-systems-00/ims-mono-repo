const cc = require("../../services/cc");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createCcCalculation = async (req, res, next) => {
  let ccCalculationService = new cc.CcCalculation(req.accessControl);
  try {
    const ccCalculation = await ccCalculationService.createCcCalculation({
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "Calculation created successfully.",
      ccCalculation,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCcCalculation = async (req, res, next) => {
  let ccCalculationService = new cc.CcCalculation(req.accessControl);
  try {
    const { id } = req.params;
    const ccCalculation = await ccCalculationService.getCcCalculation({
      _id: id,
    });
    res.status(StatusCodes.OK).json({
      message: "Calculation retrived.",
      ccCalculation,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCcCalculation = async (req, res, next) => {
  let ccCalculationService = new cc.CcCalculation(req.accessControl);
  try {
    const { id } = req.params;
    const ccCalculation = await ccCalculationService.updateCcCalculation(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "Calculation updated.",
      ccCalculation,
    });
  } catch (error) {
    next(error);
  }
};

exports.listCcCalculation = async (req, res, next) => {
  let ccCalculationService = new cc.CcCalculation(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [
        "reference",
        "scope",
        "scopeName",
        "category",
        "calculationMethod",
        "activity",
        "supplierName",
        "invoiceNumber",
        "meterNumber",
      ],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await ccCalculationService.listCcCalculation(
      query,
      options
    );
    let responseMessage = query.category
      ? query.category + " calculations retrived."
      : "Calculations retrived.";
    return res.status(StatusCodes.OK).json({
      message: responseMessage,
      pagination: formatListResponse(results).pagination,
      ccCalculations: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveCcCalculation = async (req, res, next) => {
  let ccCalculationService = new cc.CcCalculation(req.accessControl);
  try {
    const ccCalculation = await ccCalculationService.softRemoveCcCalculation(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Calculation moved to trash.",
      ccCalculation,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreCcCalculation = async (req, res, next) => {
  let ccCalculationService = new cc.CcCalculation(req.accessControl);
  try {
    const ccCalculation = await ccCalculationService.restoreCcCalculation(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Calculation restored.",
      ccCalculation,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveCcCalculation = async (req, res, next) => {
  let ccCalculationService = new cc.CcCalculation(req.accessControl);
  try {
    const ccCalculation = await ccCalculationService.hardRemoveCcCalculation(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Calculation removed.",
      ccCalculation,
    });
  } catch (error) {
    next(error);
  }
};
