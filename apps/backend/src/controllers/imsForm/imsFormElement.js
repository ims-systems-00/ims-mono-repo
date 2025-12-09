const imsForm = require("../../services/imsForms");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const { default: mongoose } = require("mongoose");

exports.createImsFormElement = async (req, res, next) => {
  let imsFormElementService = new imsForm.ImsFormElement(req.accessControl);
  try {
    const { formId } = req.params;
    const imsFormElement = await imsFormElementService.createImsFormElement({
      ...req.body,
      formId: formId,
      organization: req.accessControl?.user?.organizationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "iMS Form element Created Successfully.",
      imsFormElement,
    });
  } catch (error) {
    next(error);
  }
};

exports.changeImsFormElementOrder = async (req, res, next) => {
  let imsFormElementService = new imsForm.ImsFormElement(req.accessControl);
  try {
    const { elementId } = req.params;
    const imsFormElement =
      await imsFormElementService.changeImsFormElementOrder(elementId, {
        ...req.body,
      });

    return res.status(StatusCodes.OK).json({
      message: "iMS Form element Orger Change Successfully.",
      imsFormElement,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsFormElement = async (req, res, next) => {
  let imsFormElementService = new imsForm.ImsFormElement(req.accessControl);
  try {
    const { elementId } = req.params;
    const imsFormElement = await imsFormElementService.getImsFormElement({
      _id: elementId,
    });
    res.status(StatusCodes.OK).json({
      message: "iMS Form Element Retrived.",
      imsFormElement,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsFormElement = async (req, res, next) => {
  let imsFormElementService = new imsForm.ImsFormElement(req.accessControl);
  try {
    const { formId, elementId } = req.params;
    const imsFormElement = await imsFormElementService.updateImsFormElement(
      elementId,
      {
        ...req.body,
        formId,
      }
    );
    res.status(StatusCodes.OK).json({
      message: "iMS Form element info updated.",
      imsFormElement,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsFormElement = async (req, res, next) => {
  let imsFormElementService = new imsForm.ImsFormElement(req.accessControl);
  try {
    const formId = new mongoose.Types.ObjectId(req.params.formId);
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [""],
    })
      .build()
      .query();
    let query = { ...filter, formId: formId };

    const results = await imsFormElementService.listImsFormElement(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Element Retrieved.",
      pagination: formatListResponse(results).pagination,
      imsFormElements: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsFormElement = async (req, res, next) => {
  let imsFormElementService = new imsForm.ImsFormElement(req.accessControl);
  try {
    const imsFormElement = await imsFormElementService.softRemoveImsFormElement(
      req.params.elementId
    );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Element Moved to Trash.",
      imsFormElement,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsFormElement = async (req, res, next) => {
  let imsFormElementService = new imsForm.ImsFormElement(req.accessControl);
  try {
    const imsFormElement = await imsFormElementService.restoreImsFormElement(
      req.params.elementId
    );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Element restored.",
      imsFormElement,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsFormElement = async (req, res, next) => {
  let imsFormElementService = new imsForm.ImsFormElement(req.accessControl);
  try {
    const imsFormElement = await imsFormElementService.hardRemoveImsFormElement(
      req.params.elementId
    );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Element Removed.",
      imsFormElement,
    });
  } catch (error) {
    next(error);
  }
};
