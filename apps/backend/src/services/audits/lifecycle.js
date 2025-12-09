const { AuditCRUDOperations } = require("./audit");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
class Lifecycle extends AuditCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async markAuditAsComplete(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not remove risk from completed audit."
      );
    if (new Date() >= audit.scheduledDate)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Audit can not be completed before schedule date."
      );
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "completed.by": data.completedBy._id,
          "completed.on": Date.now(),
          "completed.status": true,
        },
      },
      { new: true }
    );
    this._postAuditCompletionTrigger(audit);
    return this.Audits.populateAudit(audit);
  }
  async _postAuditCompletionTrigger(audit) {
    if (this._isComplete(audit)) {
      const {
        cips,
        risks,
        identifications,
        group,
        auditor,
        _id: auditId,
      } = audit;
      await Promise.all(
        cips.map((cip) => {
          let { title, opportunityForImprovement, _id } = cip;
          this.Cips.create({
            organization: this.connection.user.organizationId,
            _id,
            title,
            group,
            source: { moduleType: "audits", module: auditId },
            opportunityForImprovement,
            created: {
              by: auditor,
              on: Date.now(),
            },
          });
        })
      );
      await Promise.all(
        risks.map((risk) => {
          console.log("createing...", risk.title);
          let {
            title,
            description,
            score: { likelihood, consequence },
            _id,
          } = risk;
          this.Risks.create({
            organization: this.connection.user.organizationId,
            _id,
            group,
            title,
            type: "Organisational",
            description,
            source: { moduleType: "audits", module: auditId },
            score: {
              likelihood: { initial: likelihood, current: likelihood },
              consequence: { initial: consequence, current: consequence },
              total: {
                initial: likelihood * consequence,
                current: likelihood * consequence,
              },
            },
            created: {
              by: auditor,
              on: Date.now(),
            },
          });
        })
      );
      await Promise.all(
        identifications.map((identification) => {
          const { _id, nonConformity, rootCause } = identification;
          this.Incidents.create({
            organization: this.connection.user.organizationId,
            _id,
            title: nonConformity,
            description: rootCause,
            group,
            source: { moduleType: "audits", module: auditId },
            created: {
              by: auditor,
            },
          });
        })
      );
    }
  }
}
exports.Lifecycle = Lifecycle;
