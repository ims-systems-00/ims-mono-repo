const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const ErrorHandler = require("./errorHandler");
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
