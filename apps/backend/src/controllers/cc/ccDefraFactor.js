const cc = require("../../services/cc");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.listCcDefraFactor = async (req, res, next) => {
  const ccDefraFactorService = new cc.CcDefraFactor(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["combinedActivityReference", "sicCategory"],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await ccDefraFactorService.listCcDefraFactor(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "Defra factors retrived.",
      pagination: formatListResponse(results).pagination,
      ccDefraFactors: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};
