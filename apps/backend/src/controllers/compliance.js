const { IamPolicy } = require("../services/iamPolicy");
const LicenseManagementService = require("../services/licenseManager");
const { Filters } = require("../services/utility");
const complianceServices = require("../services/complianceManager");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { trimQuery } = require("../validations/utils");
// general functions
exports.grantLicense = async (req, res, next) => {
  try {
    let { name } = req.body;
    let iamPolicy = new IamPolicy(req.accessControl);
    let licenseManager = new LicenseManagementService(
      req.accessControl.user.organizationId
    );
    await iamPolicy.initializeComlianceToolAccess(name);
    await licenseManager.utilizeComplianceToolLicenseInOrg(name);
  } catch (err) {
    logger.info("Access grant failed", err);
  }
};
exports.createComplianceTool = async (req, res, next) => {
  let complianceCrudOps = new complianceServices.ComplianceToolCRUDOps(
    req.accessControl
  );
  try {
    let controls = await complianceCrudOps.createComplianceTool(req.body);
    res
      .status(200)
      .json({ message: `Successfully created ${req.body.name}`, controls });
    next();
  } catch (err) {
    next(err);
  }
};
exports.updateComplianceTool = async (req, res, next) => {
  let complianceCrudOps = new complianceServices.ComplianceToolCRUDOps(
    req.accessControl
  );
  try {
    let controls = await complianceCrudOps.updateComplianceTool(req.body);
    res
      .status(200)
      .json({ message: `Compliance tool updated ${req.body.name}`, controls });
  } catch (err) {
    next(err);
  }
};
exports.getComplianceTool = async (req, res, next) => {
  let complianceCrudOps = new complianceServices.ComplianceToolCRUDOps(
    req.accessControl
  );
  try {
    let { page, size } = req.query;
    const options = { page, limit: size, sort: "createdAt" };
    let filter = new Filters(req, {
      searchFields: ["name", "clause", "title", "description", "annex"],
    })
      .build()
      .query();
    let query = {
      ...filter,
    };
    let results = await complianceCrudOps.getComplainceTool(query, options);
    res.status(200).json({
      message: "Compliance retrived successfully ",
      pagination: results.pagination,
      compliance: results.compliance,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateControlStatus = async (req, res, next) => {
  let controlOps = new complianceServices.ControlsManager(req.accessControl);
  try {
    let control = await controlOps.updateControlStatus({
      ...req.body,
      user: req.accessControl.user,
    });
    res.status(200).json({ message: "Control status updated.", control });
  } catch (err) {
    next(err);
  }
};

exports.updateControl = async (req, res, next) => {
  let controlOps = new complianceServices.ControlsManager(req.accessControl);
  try {
    let control = await controlOps.updateControl({
      ...req.body,
      id: req.params.id,
      user: req.accessControl.user,
    });
    res.status(200).json({ message: "Control updated.", control });
  } catch (err) {
    next(err);
  }
};

exports.getOverview = async (req, res, next) => {
  let complianceCrudOps = new complianceServices.ComplianceToolCRUDOps(
    req.accessControl
  );
  try {
    let { name } = req.params;
    let overview = await complianceCrudOps.getOverview(name);
    res.status(200).json({
      message: "Compliance overview retrived successfully ",
      overview,
    });
  } catch (err) {
    next(err);
  }
};
exports.getControl = async (req, res, next) => {
  let complianceCrudOps = new complianceServices.ComplianceToolCRUDOps(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let control = await complianceCrudOps.getControl({ _id: id });
    res
      .status(200)
      .json({ message: "Control retrived successfully ", control });
  } catch (err) {
    next(err);
  }
};
exports.addEvidence = async (req, res, next) => {
  let evidence = new complianceServices.Evidence(req.accessControl);
  try {
    let { id } = req.params;
    let control = await evidence.addEvidences(id, req.body);
    res.status(200).json({ message: "Evidence added Successfully", control });
  } catch (err) {
    next(err);
  }
};

// control evidence functions ...
exports.getControlEvidence = async (req, res, next) => {
  let evidence = new complianceServices.Evidence(req.accessControl);
  try {
    let { id } = req.params;
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };

    let filter = new Filters(req, {
      searchFields: ["evidenceType"],
    })
      .build()
      .query();

    const query = { ...filter };

    let control = await evidence.listControlEvidencesByOrg(id, query, options);
    res
      .status(200)
      .json({
        message: "Control evidence retrived successfully",
        controlEvidence: control.controlsEveidences,
        pagination: control.pagination,
      });
  } catch (err) {
    next(err);
  }
};

exports.addControlEvidence = async (req, res, next) => {
  let evidence = new complianceServices.Evidence(req.accessControl);
  try {
    let { id } = req.params;
    let controlEvidence = await evidence.addControlEvidence(id, {
      ...req.body,
      organization: req.accessControl.user.organizationId,
      updatedBy: req.accessControl.user,
    });
    res.status(201).json({ message: "Control evidence added Successfully", controlEvidence });
  } catch (err) {
    next(err);
  }
};

exports.removeControlEvidence = async (req, res, next) => {
  let evidence = new complianceServices.Evidence(req.accessControl);
  try {
    let { id, evidence_id } = req.params;
    let controlEvidence = await evidence.removeControlEvidences(id, evidence_id);
    res
      .status(200)
      .json({ message: "Control evidence removed successfully", controlEvidence });
  } catch (err) {
    next(err);
  }
};

exports.removeEvidence = async (req, res, next) => {
  let evidence = new complianceServices.Evidence(req.accessControl);
  try {
    let { id, evidence_id } = req.params;
    let control = await evidence.removeEvidences(id, {
      evidence_id,
    });
    res.status(200).json({ message: "Evidence removed successfully", control });
  } catch (err) {
    next(err);
  }
};
exports.deleteComplianceTool = async (req, res, next) => {
  let complianceCrudOps = new complianceServices.ComplianceToolCRUDOps(
    req.accessControl
  );
  try {
    let { name } = req.query;
    await complianceCrudOps.deleteComplianceTool(name);
    res.status(200).json({ message: "Conrols deleted successfully" });
  } catch (err) {
    next(err);
  }
};
