require("dotenv").config();
const { sendMail } = require("../src/email/sendMail");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
(async function () {
  try {
    const recipient = {
      name: "Sophie Filer",
      email: "reyad@imssystems.tech",
    };
    await sendMail("demo-request-recieved-confirmation", recipient.email, {
      subject: "Thank You for Requesting a Demo",
      ...recipient,
    });
    logger.info("Email sent to:", recipient);
  } catch (err) {
    logger.info(err);
  }
})();
