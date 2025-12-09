const Tenants = require("../models/mongodb/admin/tenants/tenants");
const { trimQuery } = require("../validations/utils");
const { imsPaginationFormated, Filters } = require("../services/utility");

exports.getTenants = async (req, res, next) => {
  try {
    let { keywords, page, size } = trimQuery(req.query);
    const options = { page, limit: size, sort: "-_id" };
    const filters = new Filters(req, { searchFields: ["name", "company"] })
      .build()
      .query();
    let pagination = await Tenants().paginate(
      {
        $or: [
          { company: { $regex: new RegExp(keywords, "i") } },
          { name: { $regex: new RegExp(keywords, "i") } },
        ],
      },
      options
    );
    let tenants = pagination.docs;
    res.status(200).json({
      message: "Tenants retrived successfully.",
      pagination: imsPaginationFormated(pagination),
      tenants,
    });
  } catch (err) {
    next(err);
  }
};
