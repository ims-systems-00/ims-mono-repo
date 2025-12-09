const { trimQuery } = require("../validations/utils")
exports.secureQuery = async (req, res, next) => {
    req.query = trimQuery(req.query)
    next()
}