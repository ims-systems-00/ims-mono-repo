const CustomerModel = require("../../models/mongodb/system/crm/customer");
const OrganisationModel = require("../../models/mongodb/system/organization/organization");
const EmailCampaignModel = require("../../models/mongodb/system/crm/emailCampaign");
const { asynchronously } = require("../../services/utility");
const mailQueue = require("./mail.queue");
const { FileManager } = require("../../helpers/fileManager");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
exports.consume = async (job) => {
  try {
    let connection = job.data?.accessControl;
    let Customer = CustomerModel(connection);
    let EmailCampaign = EmailCampaignModel(connection);
    let Organisation = OrganisationModel(connection);
    let fileManager = new FileManager(connection);
    let nextPage = 1;
    let org = await Organisation.findOne({
      _id: connection.user?.organizationId,
    });
    let campaign = await EmailCampaign.findOneAndUpdate(
      { _id: job.data.campaignId },
      {
        $set: { status: "Queued" },
      },
      { new: true }
    );
    let files = await Promise.all(
      campaign.attachments.map((attachment) =>
        fileManager.saveTemporaryAsync(attachment)
      )
    );
    while (nextPage) {
      let pagination = await Customer.paginate(
        {
          group: campaign.group,
          $or: [
            { stage: { $in: campaign.target } },
            { _id: { $in: campaign.customAudience } },
          ],
        },
        {
          page: nextPage,
          limit: 100,
          select: "primaryContact primaryEmail secondaryContact secondaryEmail",
        }
      );
      let customers = pagination.docs;
      logger.info(`Chunck ${nextPage}`, { length: customers.length });
      let list = [];
      for (let customer of customers) {
        if (customer.primaryContact || customer.primaryEmail)
          list.push({
            name: customer.primaryContact,
            email: customer.primaryEmail,
          });
        if (customer.secondaryContact || customer.secondaryEmail)
          list.push({
            name: customer.secondaryContact,
            email: customer.secondaryEmail,
          });
      }
      logger.info("Producing emails");
      mailQueue.produce({
        organisation: org,
        list,
        campaignId: campaign._id.toString(),
        accessControl: connection,
        files,
        lastChunk: !pagination.hasNextPage,
        customerAmount: customers.length,
      });
      nextPage = pagination.nextPage;
    }
  } catch (err) {
    logger.error("error sending campaign", err);
  }
};
exports.completeAction = async (job) => {
  let connection = job.data?.accessControl;
  let EmailCampaign = EmailCampaignModel(connection);
  await asynchronously(
    EmailCampaign.findOneAndUpdate(
      { _id: job.data.campaignId },
      {
        $set: { status: "Sent" },
      },
      { new: true }
    )
  );
};
