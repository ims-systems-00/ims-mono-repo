const { IamPolicy } = require("../services/iamPolicy");
const { trimQuery } = require("../validations/utils");
const { Filters } = require("../services/utility");
const auditServices = require("../services/audits");
const { StatusCodes } = require("http-status-codes");

exports.createAudit = async (req, res, next) => {
  let auditCrudOps = new auditServices.AuditCRUDOperations(req.accessControl);
  try {
    let scheduledAudits = await auditCrudOps.createAudit({
      ...req.body,
      organization: req.accessControl.user.organizationId,
      createdBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Audits scheduled.", audits: scheduledAudits });
  } catch (err) {
    next(err);
  }
};
exports.editAudit = async (req, res, next) => {
  let auditCrudOps = new auditServices.AuditCRUDOperations(req.accessControl);
  try {
    let { id } = req.params;
    let audit = await auditCrudOps.updateAudit(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Audit updated.", audit });
  } catch (err) {
    next(err);
  }
};
exports.getAudit = async (req, res, next) => {
  let auditCrudOps = new auditServices.AuditCRUDOperations(req.accessControl);
  try {
    let { id } = req.params;
    let audit = await auditCrudOps.getAudit({ _id: id });
    res.json({ message: "Audit retrived.", audit });
  } catch (err) {
    next(err);
  }
};
exports.getAudits = async (req, res, next) => {
  let auditCrudOps = new auditServices.AuditCRUDOperations(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let { type, page, sort, size } = trimQuery(req.query);
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let filter = new Filters(req, {
      searchFields: ["reference", "title", "focusArea", "interval"],
    })
      .build()
      .query();
    let query = { type, ...filter };
    let iamPolicy = new IamPolicy(req.accessControl);
    // if (!iamPolicy.validateGlobalAccess(groupPolicy))
    //   query = { ...query, group: session.current.group };
    let results = await auditCrudOps.listAuditsByOrg(query, options);
    res.status(StatusCodes.OK).json({
      message: "Audits retrived",
      pagination: results.pagination,
      audits: results.audits,
    });
  } catch (err) {
    next(err);
  }
};
exports.addIdentification = async (req, res, next) => {
  let identificationManager = new auditServices.IdentificationManagerOnAudit(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let audit = await identificationManager.addIdentificationToAudit(
      id,
      req.body
    );
    res
      .status(StatusCodes.OK)
      .json({ message: "Findings added to audit.", audit });
  } catch (err) {
    next(err);
  }
};
exports.updateIdentification = async (req, res, next) => {
  let identificationManager = new auditServices.IdentificationManagerOnAudit(
    req.accessControl
  );
  try {
    let { id, identification_id } = req.params;
    let audit = await identificationManager.updateIdentificationInAudit(id, {
      ...req.body,
      identification_id,
    });
    res.json({ message: "Finding updated.", audit });
  } catch (err) {
    next(err);
  }
};
exports.removeIdentification = async (req, res, next) => {
  let identificationManager = new auditServices.IdentificationManagerOnAudit(
    req.accessControl
  );
  try {
    let { id, identification_id } = req.params;
    let audit = await identificationManager.removeIdentificationFromAudit(id, {
      identification_id,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Finding removed from audit.", audit });
  } catch (err) {
    next(err);
  }
};
exports.addRisk = async (req, res, next) => {
  let riskManager = new auditServices.RiskManagerOnAudit(req.accessControl);
  try {
    let { id } = req.params;
    let audit = await riskManager.addRiskToAudit(id, req.body);
    res.status(200).json({ message: "Risk added to audit.", audit });
  } catch (err) {
    next(err);
  }
};
exports.updateRisk = async (req, res, next) => {
  let riskManager = new auditServices.RiskManagerOnAudit(req.accessControl);
  try {
    let { id, risk_id } = req.params;
    console.log("Req and param", req.params);
    let audit = await riskManager.updateRiskInAudit(id, {
      ...req.body,
      risk_id,
    });
    res.json({ message: "Risk updated", audit });
  } catch (err) {
    next(err);
  }
};
exports.removeRisk = async (req, res, next) => {
  let riskManager = new auditServices.RiskManagerOnAudit(req.accessControl);
  try {
    let { id, risk_id } = req.params;
    let audit = await riskManager.removeRiskFromAudit(id, { risk_id });
    res.status(200).json({ message: "Risk removed from audit.", audit });
  } catch (err) {
    next(err);
  }
};
exports.addOfi = async (req, res, next) => {
  let cipManager = new auditServices.CIPManagerOnAudit(req.accessControl);
  try {
    let { id } = req.params;
    let audit = await cipManager.addCIPToAudit(id, req.body);
    res.status(StatusCodes.OK).json({ message: "OFI added to audit.", audit });
  } catch (err) {
    next(err);
  }
};
exports.updateOfi = async (req, res, next) => {
  let cipManager = new auditServices.CIPManagerOnAudit(req.accessControl);
  try {
    let { id, ofi_id } = req.params;
    let audit = await cipManager.updateCIPInAudit(id, {
      ...req.body,
      ofi_id,
    });
    res.json({ message: "OFI updated.", audit });
  } catch (err) {
    next(err);
  }
};
exports.removeOfi = async (req, res, next) => {
  let cipManager = new auditServices.CIPManagerOnAudit(req.accessControl);
  try {
    let { id, ofi_id } = req.params;
    let audit = await cipManager.removeCIPFromAudit(id, {
      ofi_id,
    });
    res.status(200).json({ message: "OFI removed from audit.", audit });
  } catch (err) {
    next(err);
  }
};
exports.addAttachment = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({ message: "OFI removed.", audit: {} });
  } catch (err) {
    next(err);
  }
};
exports.removeAttachment = async (req, res, next) => {
  let auditCrudOps = new auditServices.AuditCRUDOperations(req.accessControl);
  try {
    let { id, attachment_id } = req.params;
    let audit = await auditCrudOps.deleteAttachment(id, { attachment_id });
    res
      .status(StatusCodes.OK)
      .json({ message: "Attachment removed from audit.", audit });
  } catch (err) {
    next(err);
  }
};
exports.completeAudit = async (req, res, next) => {
  let auditLifecycle = new auditServices.Lifecycle(req.accessControl);
  try {
    let { id } = req.params;
    const completedBy = req.accessControl.user;
    let audit = await auditLifecycle.markAuditAsComplete(id, { completedBy });
    res
      .status(StatusCodes.OK)
      .json({ message: "Audit has been marked as complete.", audit });
  } catch (err) {
    next(err);
  }
};
exports.removeAudit = async (req, res, next) => {
  let auditCrudOps = new auditServices.AuditCRUDOperations(req.accessControl);
  try {
    let { id } = req.params;
    let audit = await auditCrudOps.deleteAudit(id);
    res.json({ message: "Audit deleted.", audit });
  } catch (err) {
    next(err);
  }
};
exports.extractReport = async (req, res, next) => {
  let auditReport = new auditServices.AuditReports(req.accessControl);
  try {
    let { id } = req.params;
    let audit = await auditReport.extractReport(id, req.body);
    return res.status(StatusCodes.OK).json({ message: "Report sent.", audit });
  } catch (err) {
    next(err);
  }
};
exports.linkISOControls = async (req, res, next) => {
  let auditCompliance = new auditServices.ComplianceManager(req.accessControl);
  let { id } = req.params;
  try {
    let audit = await auditCompliance.linkISOControls(id, req.body);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Control addded successfully.", audit });
  } catch (err) {
    next(err);
  }
};
exports.removeISOControls = async (req, res, next) => {
  let auditCompliance = new auditServices.ComplianceManager(req.accessControl);
  let { id } = req.params;
  try {
    let audit = await auditCompliance.removeISOControls(id, req.body);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Control removed successfully.", audit });
  } catch (err) {
    next(err);
  }
};
