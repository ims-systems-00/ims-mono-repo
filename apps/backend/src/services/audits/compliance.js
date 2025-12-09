const { AuditCRUDOperations } = require("./audit");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
class ComplianceManager extends AuditCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async linkISOControls(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not link toolkit to completed audit."
      );
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          "isoControls.toolkits": data.toolkits,
        },
        $push: {
          "isoControls.clauses": data.controls,
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
  async removeISOControls(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Cannot unlink toolkit from completed audit."
      );
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $pullAll: {
          "isoControls.toolkits": data.toolkits,
        },
        $pullAll: {
          "isoControls.clauses": data.controls,
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
}
exports.ComplianceManager = ComplianceManager;
