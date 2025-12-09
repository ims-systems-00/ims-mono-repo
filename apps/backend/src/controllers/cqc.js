const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const CQCService = require("../services/cqc");
const LicenseManagementService = require("../services/licenseManager");
const NotificationService = require("../services/notification");
const { asyncWrapper, Filters } = require("../services/utility");
const { IamPolicy } = require("../services/iamPolicy");
const { trimQuery } = require("../validations/utils");

exports.createCCQTool = async (req, res, next) => {
  let compliance = new CQCService(req.accessControl);
  let policyService = new IamPolicy(req.accessControl);
  let [tool, toolError] = await compliance.buildCqcTool();
  if (toolError)
    return res
      .status(400)
      .json({ message: "Tool create failed. " + toolError.message });
  let [memberPolicies, memberPoliciesError] = await asyncWrapper(() =>
    policyService.initializeComlianceToolAccess(IMS_SERVICES.CQC)
  );
  if (memberPoliciesError)
    return res
      .status(400)
      .json({ message: "Tool create failed. " + memberPoliciesError.message });
  res.status(200).json({ message: "Tool created successfully", tool });
};
exports.authToolGrantPermision = async (req, res, next) => {
  let licenseManager = new LicenseManagementService(
    req.accessControl.user.organizationId
  );
  let [authorized, authorizationError] = await asyncWrapper(() =>
    licenseManager.authorizeToolKitGrantPermission(IMS_SERVICES.CQC)
  );
  if (authorizationError)
    return res
      .status(400)
      .json({ message: "Unauthorized request. " + authorizationError.message });
  if (authorized) next();
};
exports.grantCCQToolAccess = async (req, res, next) => {
  let compliance = new CQCService(req.accessControl);
  let licenseManager = new LicenseManagementService(req.accessControl);
  let { group } = req.body;
  let [overview, oveviewError] = await compliance.grantToolAccess(group);
  if (oveviewError)
    return res
      .status(400)
      .json({ message: "Tool create failed. " + oveviewError.message });
  licenseManager.utilizeComplianceToolLicenseInOrg(IMS_SERVICES.CQC);
  res
    .status(200)
    .json({ message: "Tool access granted successfully", overview });
};
exports.getCQCTool = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { group, page, size } = trimQuery(req.query);
  const options = { page, limit: size, sort: "createdAt" };
  let filter = new Filters(req, {
    searchFields: ["clause", "kloe", "description"],
  })
    .build()
    .query();
  let query = { group, ...filter };
  let [queryResult, toolError] = await compliance.getCqcTool(query, options);
  if (toolError)
    return res
      .status(400)
      .json({ message: "Tool not found " + toolError.message });
  res.status(200).json({
    message: "Tool retrived successfully",
    pagination: queryResult.pagination,
    tool: queryResult.controls,
  });
};
exports.getCQCOverviews = async (req, res) => {
  let { session, groupPolicy } = req.accessControl;
  let compliance = new CQCService(req.accessControl);
  let iamPolicy = new IamPolicy(req.accessControl);
  let { page, sort, size } = trimQuery(req.query);
  const options = { page, limit: size, sort };
  let query = {};
  if (!iamPolicy.validateGlobalAccess(groupPolicy))
    query = { group: session.current.group };
  let [queryResult, overviewsError] = await compliance.getCqcOverviews(
    query,
    options
  );
  if (overviewsError)
    return res
      .status(400)
      .json({ message: "Tool overview not found " + overviewsError.message });
  res.status(200).json({
    message: "Tool overview retrived successfully",
    pagination: queryResult.pagination,
    overviews: queryResult.overviews,
  });
};
exports.getCQCOverview = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { group } = req.query;
  let [overview, overviewError] = await compliance.getCqcOverview(group);
  if (overviewError)
    return res
      .status(400)
      .json({ message: "Tool overview not found " + overviewError.message });
  res
    .status(200)
    .json({ message: "Tool overview retrived successfully", overview });
};
exports.updateCQCRatings = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { group } = req.query;
  let [overview, overviewError] = await compliance.updateCqcRating(
    group,
    req.body
  );
  if (overviewError)
    return res
      .status(400)
      .json({ message: "Tool rating update failed.  " + toolError.message });
  res
    .status(200)
    .json({ message: "Tool rating updated successfully. ", overview });
};
exports.getCQCControl = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id } = req.params;
  let [tool, toolError] = await compliance.getControl(id);
  if (toolError)
    return res
      .status(400)
      .json({ message: "Control not found" + toolError.message });
  res.status(200).json({ message: "Control retrived successfully", tool });
};
exports.CQCNotice = async (req, res) => {
  let notificationService = new NotificationService({
    connection: req.accessControl,
  });
  let { group, id } = req.query;
  let data = {
    ...req.body,
    group,
    referenceType: "cqcoverviews",
    id,
    screenIdentifier: "cqc-overview",
    popUp: {
      status: "unread",
      on: Date.now(),
    },
  };
  let [notificationsError, notifications] =
    await notificationService.createNotice(data);
  if (notificationsError)
    return res.status(400).json({
      message: "Notifications create failed" + notificationsError.message,
    });
  res.status(200).json({
    message: "Notifications created success fully",
    notification: notifications[0],
  });
};
exports.updateCQCControl = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id } = req.params;
  let { group } = req.query;
  let data = {
    clause: req.body.clause,
    adopted: req.body.adopted,
  };
  let [tool, toolError] = await compliance.updateKloe(group, data);
  if (toolError) return res.status(400).json({ message: "Control not found" });
  res.status(200).json({ message: "Control updated successfully", tool });
};
exports.revokeCCQToolAccess = async (req, res, next) => {
  let compliance = new CQCService(req.accessControl);
  let { group } = req.query;
  let [tool, toolError] = await compliance.revokeToolAccess(group);
  if (toolError)
    return res
      .status(400)
      .json({ message: "Tool revoke failed. " + toolError.message });
  res.status(200).json({ message: "Tool access revoked successfully", tool });
};
exports.addEvidence = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id } = req.params;
  let [control, controlError] = await compliance.addEvidence(id, req.body);
  if (controlError)
    return res
      .status(400)
      .json({ message: "Evidence add failed" + controlError.message });
  res.status(200).json({ message: "Evidence added successfully", control });
};
exports.removeEvidence = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id, evidence_id } = req.params;
  let [control, controlError] = await compliance.deleteEvidence(
    id,
    evidence_id
  );
  if (controlError)
    return res
      .status(400)
      .json({ message: "Evidence delete failed" + controlError.message });
  res.status(200).json({ message: "Evidence deleted successfully", control });
};
exports.addComment = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id } = req.params;
  let [control, controlError] = await compliance.addComment(id, req.body);
  if (controlError)
    return res
      .status(400)
      .json({ message: "Comment add failed" + controlError.message });
  res.status(200).json({ message: "Comment added successfully", control });
};
exports.updateComment = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id, comment_id } = req.params;
  let [control, controlError] = await compliance.updateComment(
    id,
    comment_id,
    req.body
  );
  if (controlError)
    return res
      .status(400)
      .json({ message: "Comment update failed" + controlError.message });
  res.status(200).json({ message: "Comment updated successfully", control });
};
exports.removeComment = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id, comment_id } = req.params;
  let [control, controlError] = await compliance.deleteComment(id, comment_id);
  if (controlError)
    return res
      .status(400)
      .json({ message: "Comment delete failed" + controlError.message });
  res.status(200).json({ message: "Comment deleted successfully", control });
};
exports.createCompliant = async (req, res, next) => {
  let compliantServive = new CQCService(req.accessControl);
  let [compliant, compliantError] = await compliantServive.createCompliant(
    req.body
  );
  if (compliantError)
    return res
      .status(400)
      .json({ message: "Compliant create failed. " + compliantError.message });
  return res
    .status(200)
    .json({ message: "Compliant created successfully.", compliant });
};
exports.updateCompliant = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { id } = req.params;
  let data = { ...req.body, updatedBy: req.accessControl.user };
  let [compliant, compliantError] = await compliantServive.updateCompliant(
    id,
    data
  );
  if (compliantError)
    return res
      .status(400)
      .json({ message: "Compliant update failed. " + compliantError.message });
  return res
    .status(200)
    .json({ message: "Compliant updated successfully.", compliant });
};
exports.getCompliants = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { groupPolicy, session } = req.accessControl;
  let { page, sort, size } = trimQuery(req.query);
  let filter = new Filters(req, {
    searchFields: [
      "reference",
      "name",
      "address",
      "email",
      "detail",
      "typeOfService",
    ],
  })
    .build()
    .query();
  const options = { page, limit: size, sort };
  let query = { ...filter };
  let iamPolicy = new IamPolicy(req.accessControl);
  if (!iamPolicy.validateGlobalAccess(groupPolicy))
    query = { ...query, group: session.current.group };
  let [queryResult, compliantsError] = await compliantServive.getCompliants(
    query,
    options
  );
  if (compliantsError)
    return res.status(400).json({
      message: "Compliant retrival failed. " + compliantsError.message,
    });
  return res.status(200).json({
    message: "Compliant retrived successfully.",
    pagination: queryResult.pagination,
    compliants: queryResult.compliants,
  });
};
exports.getCompliantsCSV = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { groupPolicy, session } = req.accessControl;
  let { threshold } = req.query;
  let query = {};
  let iamPolicy = new IamPolicy(req.accessControl);
  if (iamPolicy.validateGlobalAccess(groupPolicy)) {
    query = threshold ? { _id: { $lt: threshold } } : {};
  } else {
    query = threshold
      ? { _id: { $lt: threshold }, group: session.current.group }
      : { group: session.current.group };
  }
  let [compliantsCSV, compliantsCSVError] =
    await compliantServive.extractCompliants(query);
  if (compliantsCSVError)
    return res.status(400).json({
      message: "Compliant retrival failed. " + compliantsError.message,
    });
  return res.status(200).send(compliantsCSV);
};
exports.getCompliant = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { id } = req.params;
  let [compliant, compliantError] = await compliantServive.getCompliant(id);
  if (compliantError)
    return res.status(400).json({
      message: "Compliant retrival failed. " + compliantError.message,
    });
  return res
    .status(200)
    .json({ message: "Compliant retrived successfully.", compliant });
};
exports.deleteCompliant = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { id } = req.params;
  let [compliant, compliantError] = await compliantServive.deleteCompliant(id);
  if (compliantError)
    return res
      .status(400)
      .json({ message: "Compliant create failed. " + compliantError.message });
  return res
    .status(200)
    .json({ message: "Compliant created successfully.", compliant });
};
exports.deleteCompliantAttachment = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { id, attachment_id } = req.params;
  let [compliant, compliantError] =
    await compliantServive.deleteComplaintAttachment(id, attachment_id);
  if (compliantError)
    return res
      .status(400)
      .json({ message: "Compliant delete failed. " + compliantError.message });
  return res
    .status(200)
    .json({ message: "Compliant delete successfully.", compliant });
};
exports.createCQCReport = async (req, res, next) => {
  let compliantServive = new CQCService(req.accessControl);
  let [cqcReport, cqcReportError] = await compliantServive.createCQCReport(
    req.body
  );
  if (cqcReportError)
    return res
      .status(400)
      .json({ message: "CQC report create failed. " + cqcReportError.message });
  return res
    .status(200)
    .json({ message: "CQC report created successfully.", cqcReport });
};
exports.resendCQCReport = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { id } = req.params;
  let [cqcReport, cqcReportError] = await compliantServive.resendCQCReport(id);
  if (cqcReportError)
    return res
      .status(400)
      .json({ message: "CQC report resend failed. " + cqcReportError.message });
  return res
    .status(200)
    .json({ message: "CQC report resend successful.", cqcReport });
};
exports.getCQCReports = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { session, groupPolicy } = req.accessControl;
  let iamPolicy = new IamPolicy(req.accessControl);
  let { page, sort, size } = trimQuery(req.query);
  let filter = new Filters(req, {
    searchFields: ["reference", "personName", "email"],
  })
    .build()
    .query();
  const options = { page, limit: size, sort };
  let query = { ...filter };
  if (!iamPolicy.validateGlobalAccess(groupPolicy))
    query = { ...query, group: session.current.group };
  let [queryResult, cqcReportsError] = await compliantServive.getCQCReports(
    query,
    options
  );
  if (cqcReportsError)
    return res.status(400).json({
      message: "CQC report retrival failed. " + cqcReportsError.message,
    });
  return res.status(200).json({
    message: "CQC reports retrived successfully.",
    pagination: queryResult.pagination,
    cqcReports: queryResult.reports,
  });
};
exports.getCQCReport = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { id } = req.params;
  let [cqcReport, cqcReportError] = await compliantServive.getCQCReport(id);
  if (cqcReportError)
    return res.status(400).json({
      message: "CQC report retrival failed. " + cqcReportError.message,
    });
  return res
    .status(200)
    .json({ message: "CQC report retrived successfully.", cqcReport });
};
exports.deleteCQCReport = async (req, res) => {
  let compliantServive = new CQCService(req.accessControl);
  let { id } = req.params;
  let [cqcReport, cqcReportError] = await compliantServive.deleteCQCReport(id);
  if (cqcReportError)
    return res
      .status(400)
      .json({ message: "CQC report delete failed. " + cqcReportError.message });
  return res
    .status(200)
    .json({ message: "CQC report deleted successfully.", cqcReport });
};
exports.createCQCWhistleBlow = async (req, res, next) => {
  let cqcService = new CQCService(req.accessControl);
  let [whistleBlow, whistleBlowError] = await cqcService.createCQCWhistleBlow(
    req.body
  );
  if (whistleBlowError)
    return res.status(400).json({
      message: "CQC report create failed. " + whistleBlowError.message,
    });
  return res
    .status(200)
    .json({ message: "CQC report created successfully.", whistleBlow });
};
exports.updateCQCWhistleBlow = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id } = req.params;
  let [whistleBlow, whistleBlowError] = await cqcService.updateCQCWhistleBlow(
    id,
    req.body
  );
  if (whistleBlowError)
    return res.status(400).json({
      message: "CQC report resend failed. " + whistleBlowError.message,
    });
  return res
    .status(200)
    .json({ message: "CQC report resend successful.", whistleBlow });
};
exports.getCQCWhistleBlows = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { user } = req.accessControl;
  let { page, sort, size } = trimQuery(req.query);
  let filter = new Filters(req, {
    searchFields: ["reference", "title", "description", "placeOfIncident"],
  })
    .build()
    .query();
  const options = { page, limit: size, sort };
  let query = {
    $or: [
      { "created.by": user._id },
      { reportedTo: user._id },
      { sharedWith: user._id },
    ],
    ...filter,
  };
  let [queryResult, whistleBlowsError] = await cqcService.getCQCWhistleBlows(
    query,
    options
  );
  if (whistleBlowsError)
    return res.status(400).json({
      message: "CQC whistle blow retrival failed. " + whistleBlowsError.message,
    });
  return res.status(200).json({
    message: "CQC reports retrived successfully.",
    pagination: queryResult.pagination,
    whistleBlows: queryResult.whistleBlows,
  });
};
exports.getCQCWhistleBlowsCSV = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { threshold } = req.query;
  let { user } = req.accessControl;
  let query = threshold
    ? {
        _id: { $lt: threshold },
        $or: [
          { "created.by": user._id },
          { reportedTo: user._id },
          { sharedWith: user._id },
        ],
      }
    : {
        $or: [
          { "created.by": user._id },
          { reportedTo: user._id },
          { sharedWith: user._id },
        ],
      };
  let [whistleBlowsCSV, whistleBlowsCSVError] =
    await cqcService.extractWistleBlows(query);
  if (whistleBlowsCSVError)
    return res.status(400).json({
      message:
        "CQC whistle blow retrival failed. " + whistleBlowsCSVError.message,
    });
  return res.status(200).send(whistleBlowsCSV);
};
exports.getCQCWhistleBlow = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id } = req.params;
  let [whistleBlow, whistleBlowError] = await cqcService.getCQCWhistleBlow(id);
  if (whistleBlowError)
    return res.status(400).json({
      message: "CQC report retrival failed. " + whistleBlowError.message,
    });
  return res
    .status(200)
    .json({ message: "CQC report retrived successfully.", whistleBlow });
};
exports.deleteWhistleBlow = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id } = req.params;
  let [whistleBlow, whistleBlowError] = await cqcService.deleteCQCWhistleBlow(
    id
  );
  if (whistleBlowError)
    return res.status(400).json({
      message: "CQC report delete failed. " + whistleBlowError.message,
    });
  return res
    .status(200)
    .json({ message: "CQC report deleted successfully.", whistleBlow });
};

exports.createCQCSignificantEvent = async (req, res, next) => {
  let cqcService = new CQCService(req.accessControl);
  let [significantEvent, significantEventError] =
    await cqcService.createCQCSignificantEvent(req.body);
  if (significantEventError)
    return res.status(400).json({
      message:
        "Significant event create failed. " + significantEventError.message,
    });
  return res.status(200).json({
    message: "Significant event created successfully.",
    significantEvent,
  });
};
exports.updateCQCSignificantEvent = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id } = req.params;
  let [significantEvent, significantEventError] =
    await cqcService.updateCQCSignificantEvent(id, req.body);
  if (significantEventError)
    return res.status(400).json({
      message:
        "Significant event resend failed. " + significantEventError.message,
    });
  return res.status(200).json({
    message: "Significant event resend successful.",
    significantEvent,
  });
};
exports.getCQCSignificantEvents = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { page, sort, size } = trimQuery(req.query);
  const options = { page, limit: size, sort };
  let filter = new Filters(req, {
    searchFields: [
      "reference",
      "title",
      "summaryOfConcerns",
      "agenciesInvolved",
    ],
  })
    .build()
    .query();
  let query = { ...filter };
  let { user, groupPolicy, session } = req.accessControl;
  let iamPolicy = new IamPolicy(req.accessControl);
  if (!iamPolicy.validateGlobalAccess(groupPolicy))
    query = { ...query, group: session.current.group };
  let [queryResult, significantEventsError] =
    await cqcService.getCQCSignificantEvents(query, options);
  if (significantEventsError)
    return res.status(400).json({
      message:
        "Significant event retrival failed. " + significantEventsError.message,
    });
  return res.status(200).json({
    message: "Significant event retrived successfully.",
    pagination: queryResult.pagination,
    significantEvents: queryResult.significantEvents,
  });
};
exports.getCQCSignificantEventsCSV = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { threshold } = req.query;
  let { user, groupPolicy, session } = req.accessControl;
  let iamPolicy = new IamPolicy(req.accessControl);
  if (iamPolicy.validateGlobalAccess(groupPolicy)) {
    query = threshold ? { _id: { $lt: threshold } } : {};
  } else {
    query = threshold
      ? { _id: { $lt: threshold }, group: session.current.group }
      : { group: session.current.group };
  }
  let [significantEvents, significantEventsError] =
    await cqcService.extractSignificantEvent(query);
  if (significantEventsError)
    return res.status(400).json({
      message:
        "Significant event retrival failed. " + significantEventsError.message,
    });
  return res.status(200).send(significantEvents);
};
exports.getCQCSignificantEvent = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id } = req.params;
  let [significantEvent, significantEventError] =
    await cqcService.getCQCSignificantEvent(id);
  if (significantEventError)
    return res.status(400).json({
      message:
        "Significant event retrival failed. " + significantEventError.message,
    });
  return res.status(200).json({
    message: "Significant event retrived successfully.",
    significantEvent,
  });
};
exports.deleteSignificantEvent = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id } = req.params;
  let [significantEvent, significantEventError] =
    await cqcService.deleteCQCSignificantEvent(id);
  if (significantEventError)
    return res.status(400).json({
      message:
        "Significant event delete failed. " + significantEventError.message,
    });
  return res.status(200).json({
    message: "Significant event deleted successfully.",
    significantEvent,
  });
};
exports.deleteSignificantEventAttachment = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id, attachment_id } = req.params;
  let [significantEvent, significantEventError] =
    await cqcService.removeCQCSignificantEventAttachment(id, attachment_id);
  if (significantEventError)
    return res.status(400).json({
      message:
        "Significant event delete failed. " + significantEventError.message,
    });
  return res.status(200).json({
    message: "Significant event deleted successfully.",
    significantEvent,
  });
};
exports.addSignificantEventAction = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id } = req.params;
  let [significantEvent, significantEventError] =
    await compliance.addSignificantEventAction(id, req.body);
  if (significantEventError)
    return res
      .status(400)
      .json({ message: "Comment add failed" + significantEventError.message });
  res
    .status(200)
    .json({ message: "Comment added successfully", significantEvent });
};
exports.updateSignificantEventAction = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id, action_id } = req.params;
  let [significantEvent, significantEventError] =
    await compliance.updateSignificantEventAction(id, action_id, req.body);
  if (significantEventError)
    return res.status(400).json({
      message: "Comment update failed" + significantEventError.message,
    });
  res
    .status(200)
    .json({ message: "Comment updated successfully", significantEvent });
};
exports.removeSignificantEventAction = async (req, res) => {
  let compliance = new CQCService(req.accessControl);
  let { id, action_id } = req.params;
  let [significantEvent, significantEventError] =
    await compliance.deleteSignificantEventAction(id, action_id);
  if (significantEventError)
    return res.status(400).json({
      message: "Comment delete failed" + significantEventError.message,
    });
  res
    .status(200)
    .json({ message: "Comment deleted successfully", significantEvent });
};
exports.createCQCSafeGuarding = async (req, res, next) => {
  let cqcService = new CQCService(req.accessControl);
  let [safeGuarding, safeGuardingError] =
    await cqcService.createCQCSafeGuarding(req.body);
  if (safeGuardingError)
    return res.status(400).json({
      message: "Safeguarding create failed. " + safeGuardingError.message,
    });
  return res
    .status(200)
    .json({ message: "Safeguarding created successfully.", safeGuarding });
};
exports.updateCQCSafeGuarding = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id } = req.params;
  let [safeGuarding, safeGuardingError] =
    await cqcService.updateCQCSafeGuarding(id, req.body);
  if (safeGuardingError)
    return res.status(400).json({
      message: "Significant event update failed. " + safeGuardingError.message,
    });
  return res
    .status(200)
    .json({ message: "Safeguarding update successful.", safeGuarding });
};
exports.getCQCSafeGuardings = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { page, sort, size } = trimQuery(req.query);
  const options = { page, limit: size, sort };
  let filter = new Filters(req, {
    searchFields: ["reference", "title", "description"],
  })
    .build()
    .query();
  let { user } = req.accessControl;
  let query = {
    $or: [{ "created.by": user._id }, { sharedWith: user._id }],
    ...filter,
  };
  let [queryResult, safeGuardingsError] = await cqcService.getCQCSafeGuardings(
    query,
    options
  );
  if (safeGuardingsError)
    return res.status(400).json({
      message: "Safeguarding retrival failed. " + safeGuardingsError.message,
    });
  return res.status(200).json({
    message: "Safeguarding retrived successfully.",
    pagination: queryResult.pagination,
    safeGuardings: queryResult.safeGuardings,
  });
};
exports.getCQCSafeGuardingsCSV = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { threshold } = req.query;
  let { user } = req.accessControl;
  let query = threshold
    ? {
        _id: { $lt: threshold },
        $or: [{ "created.by": user._id }, { sharedWith: user._id }],
      }
    : { $or: [{ "created.by": user._id }, { sharedWith: user._id }] };
  let [safeGuardings, safeGuardingsError] =
    await cqcService.extractSafeGuardings(query);
  if (safeGuardingsError)
    return res.status(400).json({
      message: "Safeguarding retrival failed. " + safeGuardingsError.message,
    });
  return res.status(200).send(safeGuardings);
};
exports.getCQCSafeGuarding = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id } = req.params;
  let [safeGuarding, safeGuardingError] = await cqcService.getCQCSafeGuarding(
    id
  );
  if (safeGuardingError)
    return res.status(400).json({
      message: "Safeguarding retrival failed. " + safeGuardingError.message,
    });
  return res
    .status(200)
    .json({ message: "SafeguardingZ retrived successfully.", safeGuarding });
};
exports.deleteSafeGuarding = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id } = req.params;
  let [safeGuarding, safeGuardingError] =
    await cqcService.deleteCQCSafeGuarding(id);
  if (safeGuardingError)
    return res.status(400).json({
      message: "Safeguarding delete failed. " + safeGuardingError.message,
    });
  return res
    .status(200)
    .json({ message: "Safeguarding deleted successfully.", safeGuarding });
};
exports.deleteSafeGuardingAttachment = async (req, res) => {
  let cqcService = new CQCService(req.accessControl);
  let { id, attachment_id } = req.params;
  let [safeGuarding, safeGuardingError] =
    await cqcService.removeCQCSafeGuardingAttachment(id, attachment_id);
  if (safeGuardingError)
    return res.status(400).json({
      message: "Safeguarding delete failed. " + safeGuardingError.message,
    });
  return res
    .status(200)
    .json({ message: "Safeguarding deleted successfully.", safeGuarding });
};
