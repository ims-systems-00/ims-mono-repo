const SERVER_EVENTS = {
  /**
   * document management
   */
  ADDED_NEW_VERSION_OF_DOCUMENT: "added-new-version-of-document",
  DOCUMENT_AUTHORISATION_REQUESTD: "document-authorisation-requested",
  DOCUMENT_SIGNATURE_REQUESTD: "document-signature-requested",
  DOCUMENT_SIGNED: "document-signed-requested",
  DOCUMENT_AUTH_REVIEWED: "document-auth-reviewed",
  ADDED_REVISED_DOCUMENT: "added-revised-document",
  DOCUMENT_CONFORMANCE_MILESTONE: "document-conformance-milestone",
  DOCUMENT_SHARED_VIA_EMAIL: "document-shared-via-email",
  /**
   * complaince and controls
   */
  CHECKOUT_POTENTIAL_COMPLAINCE: "checkout-potential-compliance",
  CONTROL_BECAME_COMPLIANT: "control-became-compliant",
  /**
   * risk management
   */
  RISK_CREATED: "risk-created",
  RISK_ESCALATED: "risk-escalated",
  RISK_MITIGATED: "risk-mitigated",
  RISK_ACCEPTED: "risk-accepted",
  RISK_OWNERSHIP_CHANGED: "risk-ownership-changed",
  /**
   * incident management
   */
  INCIDENT_CREATED: "incident-create",
  INCIDENT_ESCALATED: "incident-escalated",
  INCIDENT_RESOLVED: "incident-resolved",
  INCIDENT_OWNERSHIP_CHANGED: "incident-ownership-changed",
  /**
   * cip
   */
  OFI_CREATED: "ofi-created",
  OFI_IN_PROGRESS: "ofi-in-progress",
  OFI_IMPLEMENTED: "ofi-implemented",
  OFI_OWNERSHIP_CHANGED: "ofi-ownership-changed",
  /**
   * tasks
   */
  TASK_CREATED: "task-created",
  TASK_COMPLETED: "task-completed",
  TASK_ACCEPTANCE_BY_USER: "task-acceptance-by-user",
  NEW_USER_ADDED_TO_TASK: "new-user-added-to-task",
  TASK_IN_PROGRESS: "task-in-progress",
  /**
   * linking
   */
  TASK_HAS_BEEN_LINKED_TO_MODULE: "task-linked",
  CONTROL_HAS_BEEN_LINKED_TO_MODULE: "controls-linked",
  CONTROL_HAS_BEEN_UNLINKED_FROM_MODULE: "controls-unlinked",
  /**
   * generic
   */
  ATTACHMENT_ADDED: "attachment-added",
  NUDGED_A_PERSON: "nudged-a-person",
  AI_ANALYSIS_CONDUCTED: "analysis-conducted",
  AI_ANALYSIS_DELETED: "analysis-deleted",
};

module.exports = { SERVER_EVENTS };
