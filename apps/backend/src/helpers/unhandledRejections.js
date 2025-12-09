const ErrorHandler = require("../services/error/errorHandler");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const actionOnUnhandled = () => {
  process.on("unhandledRejection", (error, promise) => {
    logger.info("soft handling rejections ");
    let errorHandler = new ErrorHandler(error);
    errorHandler.handleError();
  });
  process.on("uncaughtException", (error) => {
    logger.info("soft handling rejections ");
    let errorHandler = new ErrorHandler(error);
    errorHandler.handleError();
  });
};
module.exports = {
  actionOnUnhandled,
};
