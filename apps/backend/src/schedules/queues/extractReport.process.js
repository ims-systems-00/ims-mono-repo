const FileHandlerService = require("../../services/fileHandler");
const { asynchronously } = require("../../services/utility");
const { sendMail } = require("../../email/sendMail");
const { build: buildPdf } = require("@ims-systems-00/ims-core/lib/pdf");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
exports.consume = async (job) => {
  try {
    await buildPdf({
      fileName: job.data?.reportOptions?.document?.fileName,
      template: job.data?.reportOptions?.template,
      data: {
        ...job.data?.reportOptions?.payload?.data,
      },
      metaInfo: {
        sentBy: job.data?.reportOptions?.payload?.sentBy,
        sentTo: job.data?.reportOptions?.payload?.sentTo,
        sentOn: moment(new Date()).format("DD/MM/YYYY h:m a"),
        organisationName: job.data?.reportOptions?.payload?.data?.organisationName,
      },
    });
    let attachments = job.data?.emailOptions?.payload?.attachments
      ? job.data?.emailOptions?.payload?.attachments
      : [];
    await sendMail(
      job.data?.emailOptions?.template,
      job.data?.emailOptions?.recipient?.email,
      {
        ...job.data?.emailOptions?.payload,
        attachments: [
          {
            filename: job.data?.reportOptions?.document?.fileName,
            path: job.data?.reportOptions?.document?.path,
          },
          ...attachments,
        ],
      }
    );
  } catch (err) {
    console.log(err)
    logger.error("error sending report", { err });
  }
};
exports.completeAction = async (job) => {
  logger.info("report extraction completed.");
  const fileHandler = new FileHandlerService();
  fileHandler.removeTemporary(job.data?.reportOptions?.document);
  job.data?.reportOptions?.files?.map((file) =>
    fileHandler.removeTemporary(file)
  );
};
