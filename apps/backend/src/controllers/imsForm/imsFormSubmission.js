const imsForm = require("../../services/imsForms");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const { default: mongoose } = require("mongoose");

exports.createImsFormSubmission = async (req, res, next) => {
  let imsFormSubmissionService = new imsForm.ImsFormSubmission(
    req.accessControl
  );
  try {
    const { formId } = req.params;
    const imsFormSubmission =
      await imsFormSubmissionService.createImsFormSubmissionWithoutTran({
        ...req.body,
        formId: formId,
        organization: req.accessControl?.user?.organizationId,
      });
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Submission created successfully.",
      imsFormSubmission,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsFormSubmission = async (req, res, next) => {
  let imsFormSubmissionService = new imsForm.ImsFormSubmission(
    req.accessControl
  );
  try {
    const { formId, submissionId } = req.params;
    const imsFormSubmission =
      await imsFormSubmissionService.getImsFormSubmission(formId, submissionId);
    res.status(StatusCodes.OK).json({
      message: "iMS Form Submission retrived.",
      imsFormSubmission,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsFormSubmission = async (req, res, next) => {
  let imsFormSubmissionService = new imsForm.ImsFormSubmission(
    req.accessControl
  );
  try {
    const { formId, submissionId } = req.params;
    const imsFormSubmission =
      await imsFormSubmissionService.updateImsFormSubmission(submissionId, {
        ...req.body,
        formId,
      });
    res.status(StatusCodes.OK).json({
      message: "iMS Form Submission info updated.",
      imsFormSubmission,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsFormSubmission = async (req, res, next) => {
  let imsFormSubmissionService = new imsForm.ImsFormSubmission(
    req.accessControl
  );
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
    const results = await imsFormSubmissionService.listImsFormSubmission(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Submission retrived.",
      pagination: formatListResponse(results).pagination,
      imsFormSubmissions: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsFormSubmission = async (req, res, next) => {
  let imsFormSubmissionService = new imsForm.ImsFormSubmission(
    req.accessControl
  );
  try {
    const imsFormSubmission =
      await imsFormSubmissionService.softRemoveImsFormSubmission(
        req.params.submissionId
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Submission moved to trash.",
      imsFormSubmission,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsFormSubmission = async (req, res, next) => {
  let imsFormSubmissionService = new imsForm.ImsFormSubmission(
    req.accessControl
  );
  try {
    const imsFormSubmission =
      await imsFormSubmissionService.restoreImsFormSubmission(
        req.params.submissionId
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Submission restored.",
      imsFormSubmission,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsFormSubmission = async (req, res, next) => {
  let imsFormSubmissionService = new imsForm.ImsFormSubmission(
    req.accessControl
  );
  try {
    const imsFormSubmission =
      await imsFormSubmissionService.hardRemoveImsFormSubmission(
        req.params.submissionId
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Form Submission removed.",
      imsFormSubmission,
    });
  } catch (error) {
    next(error);
  }
};
