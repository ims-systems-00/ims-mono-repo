const { sendMail } = require("../../email/sendMail");
const TenantModel = require("../../models/mongodb/admin/tenants/tenants");
const UserModel = require("../../models/mongodb/system/users&auth/user");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
exports.consume = async (job) => {
  let Tenant = TenantModel();
  logger.info("Retriveing tenants...");
  try {
    let teants = await Tenant.find({});
    logger.info("Tenants retrived...");
    teants.map(async (tenant) => {
      let User = UserModel();
      logger.info("Retring user chunks...", "tenant", {
        company: tenant.company,
      });
      let nextPage = 1;
      while (nextPage) {
        let pagination = await User.paginate(
          {
            "emailVerified.status": "varified",
            "systemAccess.status": "Active",
          },
          { page: nextPage, limit: 100 }
        );
        let list = pagination.docs;
        logger.info(`Chunck ${nextPage}`, { length: list.length });
        await Promise.all(
          list.map(async (recipient) => {
            logger.info("now trying... ", { email: recipient.email });
            if ([recipient.email].includes(recipient.email)) {
              logger.info("sending...", { email: recipient.email });
              try {
                await sendMail("system-updates", recipient.email, {
                  subject: "System maintenance notice!",
                  recipient,
                });
              } catch (err) {}
            }
          })
        );
        nextPage = pagination.nextPage;
        logger.info(`
          Emails sent...
          Chunk,
          ${nextPage},
          Left
          ${pagination.totalPages - nextPage}`);
      }
    });
  } catch (err) {
    logger.info(err);
  }
};
exports.completeAction = async (job) => {
  logger.info("Perform complete");
};
