const { AuditCRUDOperations } = require("./audit");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
class CIPManagerOnAudit extends AuditCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async addCIPToAudit(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not add OFI on completed audit."
      );
    let { title, opportunityForImprovement } = data;
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          cips: {
            $each: [{ title, opportunityForImprovement }],
            $position: 0,
          },
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
  async removeCIPFromAudit(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not remove OFI from completed audit."
      );
    let { ofi_id } = data;
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          cips: { _id: ofi_id },
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
  async updateCIPInAudit(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not update OFI on completed audit."
      );
    let { title, opportunityForImprovement, ofi_id } = data;
    audit = await this.Audits.findOneAndUpdate(
      { "cips._id": ofi_id },
      {
        $set: {
          "cips.$.title": title,
          "cips.$.opportunityForImprovement": opportunityForImprovement,
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
}
exports.CIPManagerOnAudit = CIPManagerOnAudit;
