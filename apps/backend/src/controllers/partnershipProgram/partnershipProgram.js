const partnership = require("../../services/partnershipProgram");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createPartnershipProgram = async (req, res, next) => {
  let partnershipService = new partnership.PartnershipProgram(
    req.accessControl
  );
  try {
    const data = {
      ...req.body,
      // userId: req.accessControl.user?._id,
    };
    const partnership = await partnershipService.createpartnershipProgram(data);
    return res.status(StatusCodes.OK).json({
      message: "Partnership created successfully.",
      partnership,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPartnershipProgram = async (req, res, next) => {
  let partnershipService = new partnership.PartnershipProgram(
    req.accessControl
  );
  try {
    const { id } = req.params;
    const partnership = await partnershipService.getPartnershipProgram({
      _id: id,
    });
    res.status(StatusCodes.OK).json({
      message: "partnership retrived.",
      partnership,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePartnershipInformation = async (req, res, next) => {
  let partnershipService = new partnership.PartnershipProgram(
    req.accessControl
  );
  try {
    const { id } = req.params;
    const partnership = await partnershipService.updatePartnershipProgramInfo(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "partnership program info updated.",
      partnership,
    });
  } catch (error) {
    next(error);
  }
};

exports.listPartnership = async (req, res, next) => {
  let partnershipService = new partnership.PartnershipProgram(
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
    let query = { ...filter };
    const results = await partnershipService.listParnershipProgramByUser(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "Partnership retrived.",
      details: {
        partnerships: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.analyticsByPartnership = async (req, res, next) => {
  let partnershipService = new partnership.PartnershipProgram(
    req.accessControl
  );
  try {
    const results = await partnershipService.analyticsByPartnership(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Partnership analytics retrived.",
      details: {
        analytics: results,
      },
    });
  } catch (error) {
    next(error);
  }
};
