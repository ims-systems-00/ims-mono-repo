const { Filters } = require("../services/utility");
const { trimQuery } = require("../validations/utils");
const { IamPolicy } = require("../services/iamPolicy");
const managementReviewService = require("../services/managementReview");
exports.createManagementReview = async (req, res, next) => {
  let managementReviewCrudOps =
    new managementReviewService.ManagementReviewCRUDOperations(
      req.accessControl
    );
  try {
    let scheduledManagementReviews =
      await managementReviewCrudOps.createManagementReview({
        ...req.body,
        organization: req.accessControl.user.organizationId,
        createdBy: req.accessControl.user,
      });
    res.status(200).json({
      message: "Management review(s) created.",
      managementReviews: scheduledManagementReviews,
    });
  } catch (err) {
    next(err);
  }
};
exports.getManagementReviews = async (req, res, next) => {
  let managementReviewCrudOps =
    new managementReviewService.ManagementReviewCRUDOperations(
      req.accessControl
    );
  try {
    let { groupPolicy, session, user } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let filter = new Filters(req, { searchFields: ["reference", "title"] })
      .build()
      .query();
    let query = { ...filter };
    let iamPolicy = new IamPolicy(req.accessControl);
    // if (iamPolicy.validateGlobalAccess(groupPolicy)) {
    //   query = { ...query, privacy: "Organisational" };
    // } else {
    //   query = {
    //     ...query,
    //     $or: [{ group: session.current.group }, { attendees: user._id }],
    //   };
    // }
    const result = await managementReviewCrudOps.listManagementReviewsByOrg(
      query,
      options
    );
    res.status(200).json({
      message: "Management reviews retrived.",
      pagination: result.pagination,
      managementReviews: result.managementReviews,
    });
  } catch (err) {
    next(err);
  }
};
exports.editManagementReview = async (req, res, next) => {
  let managementReviewCrudOps =
    new managementReviewService.ManagementReviewCRUDOperations(
      req.accessControl
    );
  try {
    let { id } = req.params;
    let managementReview = await managementReviewCrudOps.updateManagementReview(
      id,
      req.body
    );
    res
      .status(200)
      .json({ message: "Management review updated.", managementReview });
  } catch (err) {
    next(err);
  }
};
exports.addAgenda = async (req, res, next) => {
  let documents = new managementReviewService.Documents(req.accessControl);
  try {
    let { agenda } = req.body;
    let { id } = req.params;
    let managementReview = await documents.addAgenda(id, { agenda });
    res.status(200).json({ message: "Agenda(s) added.", managementReview });
  } catch (err) {
    next(err);
  }
};
exports.removeAgenda = async (req, res, next) => {
  let documents = new managementReviewService.Documents(req.accessControl);
  try {
    let { id, agenda_id } = req.params;
    let managementReview = await documents.removeAgenda(id, { agenda_id });
    res.status(200).json({ message: "Agenda(s) removed.", managementReview });
  } catch (err) {
    next(err);
  }
};
exports.addMinutes = async (req, res, next) => {
  let documents = new managementReviewService.Documents(req.accessControl);
  try {
    let { minutes } = req.body;
    let { id } = req.params;
    let managementReview = await documents.addMinutes(id, {
      minutes,
    });
    res.status(200).json({ message: "Minute(s) added.", managementReview });
  } catch (err) {
    next(err);
  }
};
exports.removeMinutes = async (req, res, next) => {
  let documents = new managementReviewService.Documents(req.accessControl);
  try {
    let { id, minute_id } = req.params;
    let managementReview = await documents.removeMinutes(id, { minute_id });
    res.status(200).json({ message: "Minute(s) removed.", managementReview });
  } catch (err) {
    next(err);
  }
};
exports.completeManagementReview = async (req, res, next) => {
  let lifecycle = new managementReviewService.Lifecycle(req.accessControl);
  try {
    let { id } = req.params;
    let managementReview = await lifecycle.markManagementReviewAsComplete(id);
    res.status(200).json({
      message: "Management review marked as complete.",
      managementReview,
    });
  } catch (err) {
    next(err);
  }
};
exports.removeManagementReview = async (req, res, next) => {
  let managementReviewCrudOps =
    new managementReviewService.ManagementReviewCRUDOperations(
      req.accessControl
    );
  try {
    let { id } = req.params;
    let managementReview = await managementReviewCrudOps.deleteManagementReview(
      id
    );
    res
      .status(200)
      .json({ message: "Management review deleted.", managementReview });
  } catch (err) {
    next(err);
  }
};
exports.getManagementReview = async (req, res, next) => {
  try {
    let managementReviewCrudOps =
      new managementReviewService.ManagementReviewCRUDOperations(
        req.accessControl
      );
    let { id } = req.params;
    let managementReview = await managementReviewCrudOps.getManagementReview({
      _id: id,
    });
    res
      .status(200)
      .json({ message: "Management review retrived.", managementReview });
  } catch (err) {
    next(err);
  }
};
exports.addAttendee = async (req, res, next) => {
  let attendeeCrud = new managementReviewService.Attendees(req.accessControl);
  try {
    let { attendee } = req.body;
    let { id } = req.params;
    let managementReview = await attendeeCrud.addAttendees(id, {
      attendee,
    });
    res.status(200).json({ message: "Attendee(s) adeed.", managementReview });
  } catch (err) {
    next(err);
  }
};
exports.deleteAttendee = async (req, res, next) => {
  let attendeeCrud = new managementReviewService.Attendees(req.accessControl);
  try {
    let { id, attendee_id } = req.params;
    let managementReview = await attendeeCrud.removeAttendees(id, {
      attendee_id,
    });
    res.status(200).json({ message: "Attendee(s) removed", managementReview });
  } catch (err) {
    next(err);
  }
};
