const txnEmail = require("../../services/txnEmail");
const { Filters, formatListResponse } = require("../../services/utility");
const { StatusCodes } = require("http-status-codes");

exports.createtxnEmail = async (req, res, next) => {
  let txnEmailService = new txnEmail.txnEmailService(req.accessControl);
  try {
    const txnEmail = await txnEmailService.createtxnEmail(req.body);
    return res.status(StatusCodes.OK).json({
      message: "Txl Email sent successfully.",
      txnEmail,
    });
  } catch (error) {
    next(error);
  }
};

exports.gettxnEmail = async (req, res, next) => {
  let txnEmailService = new txnEmail.txnEmailService(req.accessControl);
  try {
    const { id } = req.params;
    const txnEmail = await txnEmailService.gettxnEmail({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "Txl Email retrived.",
      txnEmail,
    });
  } catch (error) {
    next(error);
  }
};

exports.listtxnEmails = async (req, res, next) => {
  let txnEmailService = new txnEmail.txnEmailService(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["email"],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await txnEmailService.listtxnEmail(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Txl Emails retrived.",
      pagination: formatListResponse(results).pagination,
      txnEmails: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemovetxnEmail = async (req, res, next) => {
  let txnEmailService = new txnEmail.txnEmailService(req.accessControl);
  try {
    const txnEmail = await txnEmailService.hardRemovetxnEmail(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Txl Email removed.",
      txnEmail,
    });
  } catch (error) {
    next(error);
  }
};
