const constants = require("@ims-systems-00/ims-core/lib/constants");
exports.getConstants = async (req, res, next) => {
  try {
    const constantName = req.query.constantName;
    const data = constantName ? constants[constantName] : constants;
    return res
      .status(200)
      .json({ message: "Constants retrived successfully", data });
  } catch (err) {
    next(err)
  }
};
