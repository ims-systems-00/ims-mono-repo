const membership = require("../../services/membership/");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createMembership = async (req, res, next) => {
  let membershipService = new membership.Membership(req.accessControl);
  try {
    const membership = await membershipService.createMembership({
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "Membership created successfully.",
      membership,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMembership = async (req, res, next) => {
  let membershipService = new membership.Membership(req.accessControl);
  try {
    const { id } = req.params;
    const membership = await membershipService.getMembership({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "membership retrived.",
      membership,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMembershipInformation = async (req, res, next) => {
  let membershipService = new membership.Membership(req.accessControl);
  try {
    const { id } = req.params;
    const membership = await membershipService.updateMembershipInfo(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "Membership info updated.",
      membership,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateMembershipRole = async (req, res, next) => {
  let membershipService = new membership.Membership(req.accessControl);
  try {
    const { id } = req.params;
    const membership = await membershipService.updateMembershipRole(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "Membership role updated.",
      membership,
    });
  } catch (error) {
    next(error);
  }
};

exports.listMembership = async (req, res, next) => {
  let membershipService = new membership.Membership(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter, invitedUserId: req.accessControl.user?._id };
    const results = await membershipService.listMembership(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Membership retrived.",
      details: {
        memberships: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveMembership = async (req, res, next) => {
  let membershipService = new membership.Membership(req.accessControl);
  try {
    const membership = await membershipService.softRemoveMembership(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Membership moved to trash.",
      membership,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreMembership = async (req, res, next) => {
  let membershipService = new membership.Membership(req.accessControl);
  try {
    const membership = await membershipService.restoreMembership(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Membership restored.",
      membership,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveMembership = async (req, res, next) => {
  let membershipService = new membership.Membership(req.accessControl);
  try {
    const membership = await membershipService.hardRemoveMembership(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Membership removed.",
      membership,
    });
  } catch (error) {
    next(error);
  }
};
