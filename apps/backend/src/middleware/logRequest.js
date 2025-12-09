const { logger } = require("@ims-systems-00/ims-core/lib/logger");

exports.logRequest = async (req, res, next) => {
  console.log(new Date(), "↓", req.header("x-tenant"));
  console.info(
    "request: ",
    req.method,
    " Host:",
    req.headers.origin,
    " End point:",
    req.originalUrl
  );
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    logger.info("logging request body: ", req.body);
  }
  next();
};
