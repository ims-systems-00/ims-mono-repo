const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { APIError } = require("./apiError");
class ErroHandler {
  constructor(error) {
    this.error = error;
  }
  handleError() {
    logger.info(
      "Logging error handler: ******************************************"
    );
    console.log(this.error)
    logger.info(this.error?.message);
    logger.info(this.error?.stack);
    logger.info(
      "*****************************************************************"
    );
  }
  isTrustedAPIError() {
    if (this.error instanceof APIError) {
      return this.error.isOperational;
    }
    return false;
  }
}
module.exports = ErroHandler;
