const partnership = require("../../services/partnershipProgram");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.acceptPartnershipProgram = async (req, res, next) => {
  let partnershipService = new partnership.AdminPartnershipProgram(req.accessControl);
  try {
    const partnership = await partnershipService.acceptPartnershipProgram(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Partnership accepted Successfully.",
      partnership,
    });
  } catch (error) {
    next(error);
  }
};

exports.adminListPartnership = async (req, res, next) => {
  let partnershipService = new partnership.AdminPartnershipProgram(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await partnershipService.listParnershipProgram(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "Partnership retrived.",
      details: {
        partnership: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemovePartnershipProgram = async (req, res, next) => {
  let partnershipService = new partnership.AdminPartnershipProgram(req.accessControl);
  try {
    const partnership = await partnershipService.softRemovePartnershipProgram(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Partnership moved to trash.",
      partnership,
    });
  } catch (error) {
    next(error);
  }
};

exports.restorePartnershipProgram = async (req, res, next) => {
  let partnershipService = new partnership.AdminPartnershipProgram(req.accessControl);
  try {
    const partnership = await partnershipService.restorePartnershipProgram(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Partnership restored.",
      partnership,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemovePartnership = async (req, res, next) => {
  let partnershipService = new partnership.AdminPartnershipProgram(req.accessControl);
  try {
    const partnership = await partnershipService.hardRemovePartnershipProgram(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Partnership removed.",
      partnership,
    });
  } catch (error) {
    next(error);
  }
};
