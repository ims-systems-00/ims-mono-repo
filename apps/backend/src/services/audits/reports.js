const { AuditCRUDOperations } = require("./audit");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const extractReportQueue = require("../../schedules/queues/extractReport.queue");
class AuditReports extends AuditCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async extractReport(id, data) {
    let audit = await this.getAudit({ _id: id });
    let { name, email, sender } = data;
    email = email.toLowerCase();
    this._buildAndSendReport({
      extractionDetails: { name, email, sender },
      ...audit._doc,
    });
    return audit;
  }
  async _buildAndSendReport(data) {
    let date = new Date();
    let fileName = `Audit-${data.ID}-${date.toDateString()}-Report-.pdf`;
    let document = {
      fileName,
      path: `./temp/${fileName}`,
    };
    let files = await Promise.all(
      data.attachments.map((attachment) =>
        this.fileHandler.saveTemporaryAsync(attachment)
      )
    );
    extractReportQueue.produce({
      emailOptions: {
        template: "send-audit-report",
        recipient: {
          name: data?.extractionDetails?.name,
          email: data?.extractionDetails?.email,
        },
        payload: {
          reciever: data?.extractionDetails?.name,
          sender: data?.extractionDetails?.sender?.name,
          audit: data,
          attachments: files.map((file) => ({
            filename: file.fileName,
            path: file.path,
          })),
        },
      },
      reportOptions: {
        template: "auditReport",
        document,
        payload: {
          sentBy: {
            name: data?.extractionDetails?.sender?.name,
            email: data?.extractionDetails?.sender?.email,
          },
          sentTo: {
            name: data?.extractionDetails?.name,
            email: data?.extractionDetails?.email,
          },
          data: {
            ...data,
          },
        },
        files,
      },
    });
  }
}
exports.AuditReports = AuditReports;
