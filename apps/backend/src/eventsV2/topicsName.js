const SERVER_EVENTS_BUS = {
  /**
   * risks
   */
  NUDGE_TO_LOOK_AT_RISK: "nudge-to-look-at-risk",
  ESCALATE_RISK_EVENT: "escalate-risk-event",
  NEW_RISK_OWNER_EVENT: "new-risk-owner-event",
  MITIGATE_RISK_EVENT: "mittigate-risk-event",
  RISK_OWNERSHIP_CHANGED: "risk-ownership-changed", // only used in activity

  /**
   * incidents
   */
  NUDGE_TO_LOOK_AT_INCIDENT: "nudge-to-look-at-incident",
  NEW_INCIDENT_OWNER_EVENT: "new-incident-owner-event",
  ESCALATE_INCIDENT_EVENT: "escalate-incident-event",
  RESOLVE_INCIDENT_EVENT: "resolve-incident-event",

  /**
   * audit
   */
  NEW_AUDIT_OWNER_EVENT: "new-audit-owner-event",
  /**
   * management review
   */

  NOTIFY_ATTENDEEDS: "notify-attendeeds",
  NEW_MANAGEMENT_REVIEW_EVENT: "new-management-review-event",

  /**
   *  kpi objectives
   */

  NEW_KPI_EVENT: "new-kpi-event",

  /**
   *  supplier
   */

  NEW_SUPPLIER_BUYER_EVENT: "new-supplier-buyer-event",
  COMPLIANT_SUPPLIER_EVENT: "compliant-supplier-event",
  P1_INCIDENT_SUPPLIER_EVENT: "p1-incident-supplier-event",

  /**
   *  task
   */
  NEW_TASK_ASSIGNEE_EVENT: "new-task-assign-event",
  TASK_COMPLETED_EVENT: "task-completed-event",
  TASK_REQUEST_STATUS_CHANGE_EVENT: "task-request-status-changed-event",
  NUDGE_TO_LOOK_AT_TASK: "nudge-to-look-at-task",

  /**
   *  cip
   */
  NEW_OFI_OWNER_EVENT: "new-ofi-owner-event",
  OFI_IMPLEMENTED_EVENT: "ofi-implement-event",
  NUDGE_TO_LOOK_AT_CIP: "nudge-to-look-at-cip",

  /**
   *  document
   */
  NEW_REPOSITORY_OWNER_EVENT: "new-repository-owner-event",
  NEW_DOCUMENT_VERSION_EVENT: "new-document-version-event",
  DOCUMENT_REVISION_EVENT: "document-revision-event",
  SHARE_REPOSITORY_EVENT: "share-repository-event",
  NEW_AUTHORISE_FOR_DOCUMENT_EVENT: "new-authoriser-for-document-event",
  NEW_SIGNATURE_FOR_DOCUMENT_EVENT: "new-signature-for-document-event",
  DOCUMENT_AUTHORISE_EVENT: "document-authorised-event",
  DOCUMENT_SIGNED_EVENT: "document-authorised-event",
  DOCUMENT_FULL_CONFORMANCE_EVENT: "document-full-conformance-event",
  /**
   * crm/cutomers
   */
  CUSTOMER_STAGE_CHANGED_EVENT: "customer-stage-changed-event",
  CUSTOMER_STATUS_CHANGED_EVENT: "customer-status-changed-event",
  CUSTOMER_NEW_ACCOUNT_MANAGER_EVENT: "customer-new-account-manager-event",
  /**
   * crm/invoices
   */
  SEND_INVOICE_EVENT: "send-invoice-event",
  INVOICE_PAYMENT_COMPLETE_EVENT: "invoice-payment-complete-event",
  NEW_INVOICE_EVENT: "new-invoice-event",
  /**
   * wallet/leaves
   */
  NEW_EXPENSE_REPORT_SUBMISSION_EVENT: "new-expense-report-submission-event",
  EXPENSE_REPORT_REVIEWED_EVENT: "expense-report-reviewed-event",
  NEW_LEAVE_REQUEST_SUBMISSION_EVENT: "new-leave-request-submission-event",
  LEAVE_REQUEST_REVIEWED_EVENT: "leave-request-reviewed-event",
  /**
   * data-import
   */
  DATA_IMPORT_INITIAL_EVENT: "data-import-initiate-event",
  DATA_IMPORT_COMPLETE_EVENT: "data-import-complete-event",
  /**
   * users
   */
  USER_MENTIONED_EVENT: "user-mentioned-event",
  REFERETIAL_INTEGRITY_HANDLE_COMPLETE_EVENT:
    "referential-integrity-handle-complete-event",
  /** compliance controls */
  DATA_OWNERSHIP_TRANSFERED_EVENT: "data-ownership-transfered-event",
  CONTROL_COMPLIANCE_UPDATES: "control-compliance-updates",

  /**
   *  ims project
   */

  NEW_MEMBER_ADDED_INTO_PROJECT: "new-member-added-into-project",
  NEW_MILESTONE_CREATEED: "new-milestone-create-into-project",
  MILESTONE_DELETED: "milestone-deleted",
  IMS_PROJECT_BUDGET_ADDED: "budget-added",
  IMS_PROJECT_BUDGET_UPDATED: "budget-updated",
  IMS_PROJECT_BUDGET_DELETED: "budget-deleted",
  NEW_TASK_CREATED: "new-task-created",
  NEW_PROJECT_CREATED: "new-project-created",
  IMS_PROJECT_TASK_COMPLETE: "ims-project-task-completed",
  MILESTONE_COMPLETE: "milestone-completed",
};

module.exports = { SERVER_EVENTS_BUS };
