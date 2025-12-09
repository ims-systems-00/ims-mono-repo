const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { sendMail } = require("../../email/sendMail");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
class ErroHandler {
  constructor(error) {
    this.error = error;
  }
  handleError() {
    logger.info(
      "Logging error handler: ******************************************"
    );
    logger.info(this.error?.message);
    logger.info(this.error);
    logger.info(
      "*****************************************************************"
    );
  }
  prepareHTTPResponse() {}
}
module.exports = ErroHandler;
