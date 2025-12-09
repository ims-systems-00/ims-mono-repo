const imsForm = require("../../services/imsForms");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const { default: mongoose } = require("mongoose");

exports.createImsFormResponse = async (req, res, next) => {
  let imsFormResponseService = new imsForm.ImsFormResponse(req.accessControl);
  try {
    const { formId } = req.params;
    const imsFormResponse = await imsFormResponseService.createImsFormResponse({
      ...req.body,
      formId: formId,
      organization: req.accessControl?.user?.organizationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Response Created Successfully.",
      imsFormResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsFormResponse = async (req, res, next) => {
  let imsFormResponseService = new imsForm.ImsFormResponse(req.accessControl);
  try {
    const { responseId } = req.params;
    const imsFormResponse = await imsFormResponseService.getImsFormResponse({
      _id: responseId,
    });
    res.status(StatusCodes.OK).json({
      message: "iMS Form Response retrived.",
      imsFormResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsFormResponse = async (req, res, next) => {
  let imsFormResponseService = new imsForm.ImsFormResponse(req.accessControl);
  try {
    const { formId, responseId } = req.params;
    const imsFormResponse = await imsFormResponseService.updateImsFormResponse(
      responseId,
      {
        ...req.body,
        formId,
      }
    );
    res.status(StatusCodes.OK).json({
      message: "iMS Form Response info updated.",
      imsFormResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsFormResponse = async (req, res, next) => {
  let imsFormResponseService = new imsForm.ImsFormResponse(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = {
      ...filter,
      formId: new mongoose.Types.ObjectId(req.params.formId),
    };
    const results = await imsFormResponseService.listImsFormResponse(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Response retrived.",
      pagination: formatListResponse(results).pagination,
      imsFormResponses: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsFormResponse = async (req, res, next) => {
  let imsFormResponseService = new imsForm.ImsFormResponse(req.accessControl);
  try {
    const imsFormResponse =
      await imsFormResponseService.softRemoveImsFormResponse(
        req.params.responseId
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Response moved to trash.",
      imsFormResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsFormResponse = async (req, res, next) => {
  let imsFormResponseService = new imsForm.ImsFormResponse(req.accessControl);
  try {
    const imsFormResponse = await imsFormResponseService.restoreImsFormResponse(
      req.params.responseId
    );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Response restored.",
      imsFormResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveimsFormResponse = async (req, res, next) => {
  let imsFormResponseService = new imsForm.ImsFormResponse(req.accessControl);
  try {
    const imsFormResponse =
      await imsFormResponseService.hardRemoveImsFormResponse(
        req.params.responseId
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Response removed.",
      imsFormResponse,
    });
  } catch (error) {
    next(error);
  }
};
