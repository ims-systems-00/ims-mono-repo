// // * * * * * *
// // | | | | | |
// // | | | | | day of week
// // | | | | month
// // | | | day of month
// // | | hour
// // | minute
// // second ( optional )

const cron = require("node-cron");
const OrganizationModel = require("../models/mongodb/system/organization/organization");
const { sendMail } = require("../email/sendMail");
const OrganisationService = require("../services/organisation");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

async function tickShedule() {
  let Organization = OrganizationModel({});
  try {
    logger.info("Checkout system date schedule started....");
    const today = new Date();
    const organizations = await Organization.find({});
    await Promise.all(
      organizations.map(async (organization) => {
        if (organization.systemDate?.end < Date.now()) {
          logger.info(`${organization.name} system ended today...`);
          await sendMail("system-dates-ended", "reyad@imssystems.tech", {
            organization,
            name: "Reyad",
          });
          let organizationService = new OrganisationService({});
          await organizationService.refreshSystemDates(organization._id);
        }
      })
    );
    logger.info("Checkout system date schedule finished....");
  } catch (err) {
    console.log(err);
    logger.error("error refreshing system dates", { err });
    return null;
  }
}

exports.checkoutSystemEndDate = () => cron.schedule("0 0 * * *", tickShedule);
