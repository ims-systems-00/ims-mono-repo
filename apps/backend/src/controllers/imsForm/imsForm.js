const imsForm = require("../../services/imsForms");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createImsForm = async (req, res, next) => {
  let imsFormService = new imsForm.ImsForm(req.accessControl);
  try {
    const imsForm = await imsFormService.createImsForm({
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
      createdBy: req.accessControl?.user?._id,
    });
    return res.status(StatusCodes.OK).json({
      message: "iMS Form created successfully.",
      imsForm,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsForm = async (req, res, next) => {
  let imsFormService = new imsForm.ImsForm(req.accessControl);
  try {
    const { id } = req.params;
    const imsForm = await imsFormService.getImsForm({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "imsForm retrived.",
      imsForm,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsForm = async (req, res, next) => {
  let imsFormService = new imsForm.ImsForm(req.accessControl);
  try {
    const { id } = req.params;
    const imsForm = await imsFormService.updateImsForm(id, req.body);
    res.status(StatusCodes.OK).json({
      message: "iMS Form info updated.",
      imsForm,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsForm = async (req, res, next) => {
  let imsFormService = new imsForm.ImsForm(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await imsFormService.listImsForm(query, options);
    return res.status(StatusCodes.OK).json({
      message: "ims Form retrived.",
      pagination: formatListResponse(results).pagination,
      imsForms: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsForm = async (req, res, next) => {
  let imsFormService = new imsForm.ImsForm(req.accessControl);
  try {
    const imsForm = await imsFormService.softRemoveImsForm(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "iMS Form moved to trash.",
      imsForm,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsForm = async (req, res, next) => {
  let imsFormService = new imsForm.ImsForm(req.accessControl);
  try {
    const imsForm = await imsFormService.restoreImsForm(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "iMS Form restored.",
      imsForm,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsForm = async (req, res, next) => {
  let imsFormService = new imsForm.ImsForm(req.accessControl);
  try {
    const imsForm = await imsFormService.hardRemoveImsForm(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "iMS Form removed.",
      imsForm,
    });
  } catch (error) {
    next(error);
  }
};
