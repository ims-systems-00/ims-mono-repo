const {
  verifyEmail,
  isDisposableEmail,
  isFreeEmail,
} = require("@devmehq/email-validator-js");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
exports.deepValidateEmail = async (email) => {
  let results = {};
  try {
    results = await verifyEmail({
      emailAddress: email,
      verifyMx: true,
    });
  } catch (err) {
    logger.error("email checker error " + err.message, err);
  }
  return {
    validFormat: results.validFormat,
    validMx: results.validMx,
    validSmtp: results.validSmtp,
    isFree: isFreeEmail(email),
    isDisposable: isDisposableEmail(email),
  };
};
