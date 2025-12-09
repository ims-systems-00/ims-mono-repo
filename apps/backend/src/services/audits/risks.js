const { AuditCRUDOperations } = require("./audit");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
class RiskManagerOnAudit extends AuditCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async addRiskToAudit(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not add risk on completed audit."
      );
    let { title, description, likelihood, consequence } = data;
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          risks: {
            $each: [
              {
                title,
                description,
                score: {
                  likelihood,
                  consequence,
                  total: likelihood * consequence,
                },
              },
            ],
            $position: 0,
          },
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
  async removeRiskFromAudit(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not remove risk from completed audit."
      );
    let { risk_id } = data;
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          risks: { _id: risk_id },
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
  async updateRiskInAudit(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not update risk on completed audit."
      );
    let { title, description, likelihood, consequence, risk_id } = data;
    audit = await this.Audits.findOneAndUpdate(
      { "risks._id": risk_id },
      {
        $set: {
          "risks.$.title": title,
          "risks.$.description": description,
          "risks.$.score.likelihood": likelihood,
          "risks.$.score.consequence": consequence,
          "risks.$.score.total": likelihood * consequence,
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
}
exports.RiskManagerOnAudit = RiskManagerOnAudit;
