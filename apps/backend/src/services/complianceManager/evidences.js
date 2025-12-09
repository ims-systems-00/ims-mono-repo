const { ComplianceToolCRUDOps } = require("./compliance");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
class Evidence extends ComplianceToolCRUDOps {
  constructor(connection) {
    super(connection);
  }
  async addEvidences(id, data) {
    let { evidences } = data;
    let control = await this.ControlStatuses.findOneAndUpdate(
      { _id: id },
      {
        $push: { evidences: evidences },
      },
      { new: true }
    );
    return this.ControlStatuses.populateControl(control);
  }
  async removeEvidences(id, data) {
    let control = await this.ControlStatuses.findOneAndUpdate(
      { _id: id },
      {
        $pull: { evidences: { _id: data.evidence_id } },
      },
      { new: true }
    );
    return this.ControlStatuses.populateControl(control);
  }

  async listControlEvidencesByOrg(id, query = {}, options = {}) {
    let pagination = await this.ControlEvidences.paginateByOrg(
      this.connection?.user?.organizationId,
      { controlStatusId: id, ...query },
      options
    );
    let controlsEveidences = pagination.docs;
    controlsEveidences = await Promise.all(
      controlsEveidences.map(async (control) =>
        this.ControlEvidences.populateControl(control)
      )
    );
    return {
      controlsEveidences,
      pagination: this.imsPaginationFormated(pagination),
    };
  }

  async addControlEvidence(controlStatusId, data) {
    if (data.evidenceType === "risk-management") {
      let riskRef = await this.ControlEvidences.findOne({
        controlStatusId,
        relatedRisk: data.relatedRisk,
      });
      if (riskRef)
        throw new APIError(
          ReasonPhrases.CONFLICT,
          StatusCodes.CONFLICT,
          "Risk reference already exists"
        );
    }

    if (data.evidenceType === "incident-management") {
      let incidentRef = await this.ControlEvidences.findOne({
        controlStatusId,
        relatedIncident: data.relatedIncident,
      });
      if (incidentRef)
        throw new APIError(
          ReasonPhrases.CONFLICT,
          StatusCodes.CONFLICT,
          "Incident reference already exists"
        );
    }

    if (data.evidenceType === "cip") {
      let cipRef = await this.ControlEvidences.findOne({
        controlStatusId,
        relatedCip: data.relatedCip,
      });
      if (cipRef)
        throw new APIError(
          ReasonPhrases.CONFLICT,
          StatusCodes.CONFLICT,
          "CIP reference already exists"
        );
    }

    if (data.evidenceType === "document-management") {
      let documentRef = await this.ControlEvidences.findOne({
        controlStatusId,
        relatedDocument: data.relatedDocument,
      });
      if (documentRef)
        throw new APIError(
          ReasonPhrases.CONFLICT,
          StatusCodes.CONFLICT,
          "Document reference already exists"
        );
    }

    let controlEvidence = await this.ControlEvidences.create({
      controlStatusId,
      ...data,
    });
    return this.ControlEvidences.populateControl(controlEvidence);
  }

  async removeControlEvidences(id, evidence_id) {
    let controlEvidence = await this.ControlEvidences.findOneAndDelete({
      controlStatusId: id,
      _id: evidence_id,
    });
    return this.ControlEvidences.populateControl(controlEvidence);
  }
}
exports.Evidence = Evidence;
