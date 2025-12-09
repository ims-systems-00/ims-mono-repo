const { IamPolicy } = require("../services/iamPolicy");
const { Filters } = require("../services/utility");
const { trimQuery } = require("../validations/utils");
const FileHandlerService = require("../services/fileHandler");
const incidentService = require("../services/incidentManagement");
const { StatusCodes } = require("http-status-codes");
exports.createIncident = async (req, res, next) => {
  let incidentCrudOps = new incidentService.IncidentCRUDOperations(
    req.accessControl
  );
  let moduleType = req.header("x-moduleType");
  let moduleId = req.header("x-moduleId");
  try {
    let incident = await incidentCrudOps.createIncident({
      ...req.body,
      organization: req.accessControl.user.organizationId,
      moduleId,
      moduleType,
      createdBy: req.accessControl.user,
    });
    res.json({ message: "Incident created.", incident });
  } catch (err) {
    next(err);
  }
};
exports.getIncidents = async (req, res, next) => {
  let incidentCrudOps = new incidentService.IncidentCRUDOperations(
    req.accessControl
  );
  try {
    let { groupPolicy, session } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [
        "reference",
        "title",
        "description",
        "resolution",
        "methodOfNotification",
        "priority",
        "affectedService",
      ],
    })
      .build()
      .query();
    let query = { "source.moduleType": "incidents", ...filter };
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (!iamPolicy.validateGlobalAccess(groupPolicy))
    //   query = { ...query, group: session.current.group };
    const results = await incidentCrudOps.listIncidentsByOrg(query, options);
    res.status(StatusCodes.OK).json({
      message: "Incidents retrived.",
      pagination: results.pagination,
      incidents: results.incidents,
    });
  } catch (err) {
    next(err);
  }
};
exports.editIncident = async (req, res, next) => {
  let incidentCrudOps = new incidentService.IncidentCRUDOperations(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let incident = await incidentCrudOps.updateIncident(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Incident updated.", incident });
  } catch (err) {
    next(err);
  }
};
exports.getIncident = async (req, res, next) => {
  let incidentCrudOps = new incidentService.IncidentCRUDOperations(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let incident = await incidentCrudOps.getIncident({ _id: id });
    res
      .status(StatusCodes.OK)
      .json({ message: "Incident retrived.", incident });
  } catch (err) {
    next(err);
  }
};
exports.deleteIncident = async (req, res, next) => {
  let incidentCrudOps = new incidentService.IncidentCRUDOperations(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let incident = await incidentCrudOps.deleteIncident(id);
    res.status(StatusCodes.OK).json({ message: "Incident deleted.", incident });
  } catch (err) {
    next(err);
  }
};
exports.deleteAttachment = async (req, res, next) => {
  let incidentCrudOps = new incidentService.IncidentCRUDOperations(
    req.accessControl
  );
  try {
    let { id, attachment_id } = req.params;
    let incident = await incidentCrudOps.deleteAttachment(id, {
      attachment_id,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Attachment deleted from incident.", incident });
  } catch (err) {
    next(err);
  }
};
exports.escalateIncident = async (req, res, next) => {
  let incidentLifecycle = new incidentService.Lifecycle(req.accessControl);
  try {
    let { id } = req.params;
    let incident = await incidentLifecycle.escalateIncident(id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Incident escalated.", incident });
  } catch (err) {
    next(err);
  }
};
exports.resolveIncident = async (req, res, next) => {
  let incidentLifecycle = new incidentService.Lifecycle(req.accessControl);
  try {
    let { id } = req.params;
    let incident = await incidentLifecycle.markIncidentAsResolved(id, {
      ...req.body,
      resolvedBy: req.accessControl.user,
    });
    res.json({ message: "Incident resolved.", incident });
  } catch (err) {
    next(err);
  }
};
exports.getIncidentsReport = async (req, res, next) => {
  let incidentReport = new incidentService.IncidentReports(req.accessControl);
  let fileHandlerService = new FileHandlerService(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let filter = new Filters(req).build().query();
    let query = { "source.moduleType": "incidents", ...filter };
    let iamPolicy = new IamPolicy(req.accessControl);
    if (!iamPolicy.validateGlobalAccess(groupPolicy))
      query = { ...query, group: session.current.group };

    let csvresponse = await incidentReport.extractReport(query);
    res.status(StatusCodes.OK).sendFile(csvresponse.file);
    res.on("finish", function () {
      fileHandlerService.removeTemporary(csvresponse);
    });
  } catch (err) {
    next(err);
  }
};
exports.linkISOControls = async (req, res, next) => {
  let incidentCompliance = new incidentService.ComplianceManager(
    req.accessControl
  );
  let { id } = req.params;
  try {
    let incident = await incidentCompliance.linkISOControls(id, {
      ...req.body,
      user: req.accessControl.user,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Control addded successfully.", incident });
  } catch (err) {
    next(err);
  }
};
exports.removeISOControls = async (req, res, next) => {
  let incidentCompliance = new incidentService.ComplianceManager(
    req.accessControl
  );
  let { id } = req.params;
  try {
    let incident = await incidentCompliance.removeISOControls(id, {
      ...req.body,
      user: req.accessControl.user,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Control removed successfully.", incident });
  } catch (err) {
    next(err);
  }
};
