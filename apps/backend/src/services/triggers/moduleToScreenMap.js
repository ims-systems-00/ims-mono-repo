const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const {
  screens,
} = require("../../models/mongodb/schemaTemplates/utils/screens");
const map = {
  [moduleTypes.risks]: screens.risk_management_detail,
  [moduleTypes.incidents]: screens.incident_management_detail,
  [moduleTypes.cips]: screens.continual_improvement_plan_detail,
  [moduleTypes.documentrepositories]: screens.document_management_detail,
  [moduleTypes.documenttrees]: screens.document_version_detail,
  [moduleTypes.suppliers]: screens.supplier_management_detail,
  [moduleTypes.customers]: screens.customer_detail,
  [moduleTypes.controlstatuses]: screens.compliance_function_detail,
  [moduleTypes.cqcdetails]: screens.cqc_overview,
  [moduleTypes.tasks]: screens.task_manager_detail,
  ["internal" + moduleTypes.audits]: screens.internal_audit_detail,
  ["external" + moduleTypes.audits]: screens.external_audit_detail,
  [moduleTypes.expensereports]: screens.expense_report_detail,
  [moduleTypes.leaves]: screens.leave_request_detail,
};
module.exports = {
  moduleToScreenMap: map,
};
