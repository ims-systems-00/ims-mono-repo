const cc = require("../../services/cc");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createCcCustomFactor = async (req, res, next) => {
  let ccCustomFactorService = new cc.CcCustomFactor(req.accessControl);
  try {
    const ccCustomFactor = await ccCustomFactorService.createCcCustomFactor({
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "cc custom factor created successfully.",
      ccCustomFactor,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCcCustomFactor = async (req, res, next) => {
  let ccCustomFactorService = new cc.CcCustomFactor(req.accessControl);
  try {
    const { id } = req.params;
    const ccCustomFactor = await ccCustomFactorService.getCcCustomFactor({
      _id: id,
    });
    res.status(StatusCodes.OK).json({
      message: "cc custom factor retrived.",
      ccCustomFactor,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCcCustomFactor = async (req, res, next) => {
  let ccCustomFactorService = new cc.CcCustomFactor(req.accessControl);
  try {
    const { id } = req.params;
    const ccCustomFactor = await ccCustomFactorService.updateCcCustomFactor(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "cc custom factor info updated.",
      ccCustomFactor,
    });
  } catch (error) {
    next(error);
  }
};

exports.listCcCustomFactor = async (req, res, next) => {
  let ccCustomFactorService = new cc.CcCustomFactor(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["combinedActivityReference"],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await ccCustomFactorService.listCcCustomFactor(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "cc custom factor retrived.",
      pagination: formatListResponse(results).pagination,
      ccCustomFactors: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveCcCustomFactor = async (req, res, next) => {
  let ccCustomFactorService = new cc.CcCustomFactor(req.accessControl);
  try {
    const ccCustomFactor = await ccCustomFactorService.softRemoveCcCustomFactor(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "cc custom factor moved to trash.",
      ccCustomFactor,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreCcCustomFactor = async (req, res, next) => {
  let ccCustomFactorService = new cc.CcCustomFactor(req.accessControl);
  try {
    const ccCustomFactor = await ccCustomFactorService.restoreCcCustomFactor(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "cc custom factor restored.",
      ccCustomFactor,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveCcCustomFactor = async (req, res, next) => {
  let ccCustomFactorService = new cc.CcCustomFactor(req.accessControl);
  try {
    const ccCustomFactor = await ccCustomFactorService.hardRemoveCcCustomFactor(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "cc custom factor removed.",
      ccCustomFactor,
    });
  } catch (error) {
    next(error);
  }
};
