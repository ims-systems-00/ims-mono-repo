const client = require("@sendgrid/client");
const invitation = require("../../services/invitation/");
const { Filters, formatListResponse } = require("../../services/utility");
const { StatusCodes } = require("http-status-codes");

exports.createInvitation = async (req, res, next) => {
  let invitationService = new invitation.Invitation(req.accessControl);
  try {
    const invitation = await invitationService.createInvitation({
      ...req.body,
      clientUrl: req.headers.origin,
      createdBy: req.accessControl.user._id,
    });
    return res.status(StatusCodes.OK).json({
      message: "Invitation sent successfully.",
      details: { invitation },
    });
  } catch (error) {
    next(error);
  }
};

exports.getInvitation = async (req, res, next) => {
  let invitationService = new invitation.Invitation(req.accessControl);
  try {
    const { id } = req.params;
    const invitation = await invitationService.getInvitation({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "Invitation retrived.",
      details: { invitation },
    });
  } catch (error) {
    next(error);
  }
};

exports.resendInvitation = async (req, res, next) => {
  let invitationService = new invitation.Invitation(req.accessControl);
  try {
    const { id } = req.params;
    const invitation = await invitationService.resendInvitation(id, {
      clientUrl: req.headers.origin,
    });
    res.status(StatusCodes.OK).json({
      message: "Invitation updated.",
      details: { invitation },
    });
  } catch (error) {
    next(error);
  }
};

exports.listInvitations = async (req, res, next) => {
  let invitationService = new invitation.Invitation(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await invitationService.listInvitations(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Invitations retrived.",
      details: {
        invitations: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.removeInvitation = async (req, res, next) => {
  let invitationService = new invitation.Invitation(req.accessControl);
  try {
    const invitation = await invitationService.removeInvitation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Invitation removed.",
      details: { invitation },
    });
  } catch (error) {
    next(error);
  }
};

exports.acceptInvitation = async (req, res, next) => {
  let invitationService = new invitation.Invitation(req.accessControl);
  try {
    const token = await req.header("x-invitation-token");
    const invitation = await invitationService.acceptInvitation(token);
    return res.status(StatusCodes.OK).json({
      message: "Invitation accepted.",
      details: { invitation },
    });
  } catch (error) {
    next(error);
  }
};
