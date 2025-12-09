const { sendMail } = require("../../email/sendMail");
const { asynchronously } = require("../../services/utility");
const EmailCampaignModel = require("../../models/mongodb/system/crm/emailCampaign");
const CampaignDeliveryModel = require("../../models/mongodb/system/crm/campaignDelivary");
const { FileManager } = require("../../helpers/fileManager");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
exports.consume = async (job) => {
  try {
    let connection = job.data?.accessControl;
    let EmailCampaign = EmailCampaignModel(connection);
    let CampaignDelivery = CampaignDeliveryModel(connection);
    logger.info("mail job data", job.data);
    let campaign = await EmailCampaign.findOneAndUpdate(
      { _id: job.data.campaignId },
      {
        $inc: {
          totalCustomers: job.data.customerAmount,
        },
      }
    );
    let populatedCampaign = await EmailCampaign.populateCampaign(campaign);
    await Promise.all(
      job.data.list.map((recipient) =>
        sendMail(
          "customer-campaign",
          recipient.email,
          {
            subject: populatedCampaign.subject,
            campaign: populatedCampaign,
            recipient,
            signature: job.data.organisation.name,
            attachments: job.data.files.map((file) => ({
              filename: file.fileName,
              path: file.path,
            })),
          },
          {
            multiple: true,
            service: "sendgrid",
            replyTo: job.data.organisation.campaignEmail,
          }
        )
      )
    );
    await CampaignDelivery.create({
      campaign: job.data.campaignId,
      recipients: job.data.list,
      total: job.data.list.length,
      organization: job.data.organisation?._id,
    });
    logger.info("Chunk has been sent...");
  } catch (err) {
    logger.error("campaing send error: ", err);
  }
};
exports.completeAction = async (job) => {
  let connection = job.data?.accessControl;
  let EmailCampaign = EmailCampaignModel(connection);
  let fileManager = new FileManager(connection);
  if (job.data.lastChunk && job.data.files.length) {
    logger.info("Cleaning up attachments.");
    job.data.files.map((file) => fileManager.removeTemporary(file));
    await asynchronously(
      EmailCampaign.findOneAndUpdate(
        { _id: job.data.campaignId },
        {
          $set: { status: "Sent", launchedAt: Date.now() },
        },
        { new: true }
      )
    );
  }
};
