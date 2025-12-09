const { AuditCRUDOperations } = require("./audit");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
class IdentificationManagerOnAudit extends AuditCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async addIdentificationToAudit(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not add findings on completed audit."
      );
    let { rootCause, cip, nonConformity } = data;
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          identifications: { rootCause, nonConformity },
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
  async removeIdentificationFromAudit(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not remove findings from completed audit."
      );
    let { identification_id } = data;
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          identifications: { _id: identification_id },
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
  async updateIdentificationInAudit(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not update findings on completed audit."
      );
    let { rootCause, nonConformity, identification_id } = data;
    audit = await this.Audits.findOneAndUpdate(
      { "identifications._id": identification_id },
      {
        $set: {
          "identifications.$.rootCause": rootCause,
          "identifications.$.nonConformity": nonConformity,
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
}
exports.IdentificationManagerOnAudit = IdentificationManagerOnAudit;
