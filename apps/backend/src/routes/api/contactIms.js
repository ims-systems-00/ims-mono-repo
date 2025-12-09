const express = require("express");
const { sendMail } = require("../../email/sendMail");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const router = express.Router();
const { validate } = require("../../middleware/validator");
const contactIms = require("../../validations/contactIms");
const validateBody = validate("body");
router.get("/bookeddates", async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    logger.info(err);
    res.status(400).json(err);
  }
});

router.post(
  "/bookdate",
  [validateBody(contactIms.bookDateSchema)],
  async (req, res) => {
    logger.info(req.body);
    try {
      let {
        name,
        email,
        jobTitle,
        phone,
        organisationName,
        additionalInformation,
        bookedDate,
      } = req.body;
      await sendMail(
        "demo-bookings",
        [
          "nuraz.zamal@imssystems.tech",
          "hello@imssystems.tech",
          "zain@imssystems.tech",
        ],
        {
          name,
          email,
          jobTitle,
          organisationName,
          additionalInformation,
          bookedDate,
          phone,
        }
      );
      await sendMail("demo-request-recieved-confirmation", email, {
        subject: "Thank You for Requesting a Demo",
        name,
      });
      res.status(200).json({
        message:
          "Your request has been recorded, we will reach out to you in due course",
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ msg: err.message });
    }
  }
);

router.post(
  "/getstarted",
  [validateBody(contactIms.getStartedSchema)],
  async (req, res) => {
    try {
      let {
        name,
        email,
        phone,
        jobTitle,
        service,
        organisationName,
        iso27001,
        iso27002,
        iso20000,
        iso45001,
        iso9001,
        iso14001,
        iso22301,
      } = req.body;
      sendMail(
        "get-started",
        [
          "nuraz.zamal@imssystems.tech",
          "hello@imssystems.tech",
          "nurul@imssystems.tech",
          "zain@imssystems.tech",
        ],
        {
          name,
          email,
          phone,
          jobTitle,
          organisationName,
          service,
          standareds: [
            iso14001,
            iso20000,
            iso27001,
            iso27002,
            iso45001,
            iso9001,
            iso22301,
          ],
        }
      );
      res.status(200).json({
        message:
          "Your request has been recorded, we will reach out to you in due course",
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ msg: err.message });
    }
  }
);

module.exports = router;