export const ROLES = {
  IMS_ADMINISTRATOR: "iMS Administrator",
  IMS_HOS: "iMS Head of service",
  IMS_AUDITOR: "iMS Auditor",
  IMS_BASIC: "iMS Basic",
  /** TODo: delete all above */
  SUPER_ADMIN: "Super Admin",
  HEAD_OF_SERVICE: "Head of Service",
  BASIC_USER: "Basic User",
  AUDITOR: "Auditor",
  INTERNAL_AUDITOR: "Internal Auditor",
  EXTERNAL_AUDITOR: "External Auditor",
  EXTERNAL_USER: "External User",
};

export const IMS_POLICIES = {
  IMS_SYSTEM_ADMINISTRATION: "iMS System administration",
  IMS_BUSINESS_FUNCTION: "iMS Business function",
  IMS_COMPLIANCE_FUNCTION: "iMS Compliance body",
  IMS_SUPER_ADMIN_USER: "iMS Super admin",
  IMS_HOS_USER: "iMS Head of service",
  IMS_BASIC_USER: "iMS Basic user",
  IMS_AUDITOR_USER: "iMS Auditor",
  CUSTOM_FUNCTION: "Custom build",
};
export const IMS_SERVICES = {
  DASHBOARD: "Dashboard",
  OUR_IMS: "Our iMS",
  ORGANISATION: "Organisation",
  IAM_GROUPS: "Business units",
  IAM_PREMISES: "Premises",
  IAM_ROLES: "Roles",
  IAM_ACCESS_POLICIES: "Access policies",
  INVENTORY: "Inventory",
  INVITATIONS: "Invitation",
  MEMBERSHIPS: "Membership",
  PARTNERSHIPS: "Partnership",
  RISK_MANAGEMENT: "Risk management",
  INCIDENT_MANAGEMENT: "Incident management",
  AUDIT: "Audit",
  MANAGEMENT_REVIEW: "Management review",
  KPI_OBJECTIVE: "Kpi/Objectives",
  CONTINUAL_IMPROVEMENT_PLAN: "Continual improvement plan",
  COMPLIANCE_TOOL: "Compliance toolkits",
  SUPPLIER_MANAGEMENT: "Supplier management",
  DOCUMENT_MANAGEMENT: "Document management",
  TASK_MANAGER: "Task manager",
  CALENDAR: "Calendar",
  PROJECT_MANAGEMENT: "Project management",
  USERS: "Users",
  NOTIFICATIONS: "Notifications",
  LICENSE_MANAGEMENT: "License management",
  CQC: "CQC",
  CRM: "CRM",
  ISO20000: "ISO 20000",
  ISO27001: "ISO 27001",
  ISO27001_2022: "ISO 27001 (2022)",
  ISO27001_2022_ANNEX_A: "ISO 27001 (2022 Annex A)",
  ISO27002: "ISO 27002",
  ISO9001: "ISO 9001",
  ISO45001: "ISO 45001",
  ISO14001: "ISO 14001",
  ISO15686_5: "ISO 15686-5",
  DSPTNHS: "DSPT",
  BS9997: "BS 9997",
  ESG_GOVERNANCE: "ESG Toolkit - Governance",
  ESG_SOCIAL: "ESG Toolkit - Social",
  ESG_ENVIRONMENTAL: "ESG Toolkit - Environmental",
  SYSTEM_DEFAULTS: "System configuration",
};
export const CUSTOMIZABLE_SERVICES = {
  INVENTORY: "Inventory",
  RISK_MANAGEMENT: "Risk management",
  INCIDENT_MANAGEMENT: "Incident management",
  MANAGEMENT_REVIEW: "Management review",
  KPI_OBJECTIVE: "Kpi/Objectives",
  CONTINUAL_IMPROVEMENT_PLAN: "Continual improvement plan",
  SUPPLIER_MANAGEMENT: "Supplier management",
  DOCUMENT_MANAGEMENT: "Document management",
  CALENDAR: "Calendar",
};
export const PERMISSIONS = {
  WRITE: "Write",
  READ: "Read",
  DELETE: "Delete",
};
export const ACCESS_SCOPE = {
  ALL_BUSINESS_UNIT: "All business unit",
  SINGLE_BUSINESS_UNIT: "Single business unit",
};
export const ACCESS_POLICY_TYPE = {
  IMS_MANAGED: "iMS managed",
  CUSTOMER_MANAGED: "Customer managed",
};
export const POLICY_USAGE = {
  BUSINESS_UNIT: "Business unit",
  ROLES: "Roles",
};
export const ROLE_TYPES = {
  PREMITIVE: "Premitive",
  CUSTOM: "Custom",
};
export const EFFECTS = {
  ALLOW: "Allow",
  BLOCK: "Block",
  ALL: "All",
};
export const ACTIONS = {
  ALL: "all",
  CREATE: "create",
  UPDATE: "update",
  READ: "read",
  DELETE: "delete",
  MANAGE: "manage", // has to be as it is
  INVITE: "invite",
  COMPLETE: "complete",
  SCHEDULE: "schedule",
};
export const GROUP_TYPE = {
  INTERNAL_BU: "Internal business function",
  INTERNAL_CU: "Internal compliance function",
  EXTERNAL_CU: "External compliance function",
  EXTERNAL_U: "External function",
};
export const LICENSES = {
  TYPE: {
    BASIC: "basic",
    COMPLIANCE: "compliance",
    PARTNER: "partner",
  },
  BUSINESSFUNCTION: "businessFunction",
  ENDUSER: "endUser",
  ISO20000: "iso20000",
  ISO27001: "iso27001",
  ISO27002: "iso27002",
  ISO9001: "iso9001",
  ISO45001: "iso45001",
  ISO14001: "iso14001",
  ISO15686_5: "Iso 15686-5",
  DSPTNHS: "dsptNhs",
  BS9997: "BS 9997",
  CQC: "cqc",
  INVENTORY: "inventory",
  RISK_MANAGEMENT: "risk-management",
  INCIDENT_MANAGEMENT: "incident-management",
  AUDITS: "audits",
  MANAGEMENT_REVIEW: "management-review",
  CALENDAR: "calendar",
  TASK_MANAGER: "task-manager",
  DOCUMENT_MANAGEMENT: "document-management",
  CIP: "cip",
  SUPPLIER_MANAGEMENT: "supplier-management",
  COMPLIANCE: "compliance",
  PROJECT_MANAGEMENT: "project-management",
};
export const USER_TYPE = {
  INTERNAL: "Internal",
  EXTERNAL: "External",
};

export const RESOURCES = {
  ALL: "All",
  CQC: "CQC",
  ISO20000: "ISO 20000",
  ISO27001: "ISO 27001",
  ISO27001_2022: "ISO 27001 (2022)",
  ISO27001_2022_ANNEX_A: "ISO 27001 (2022 Annex A)",
  ISO27002: "ISO 27002",
  ISO9001: "ISO 9001",
  ISO45001: "ISO 45001",
  ISO14001: "ISO 14001",
  ISO15686_5: "ISO 15686-5",
  DSPTNHS: "DSPT",
  BS9997: "BS 9997",
};
export const ADDITIONALMODULES = {
  CRM: "CRM",
};
export const COMPLIANCE_TOOLS = {
  ISO20000: "ISO 20000",
  ISO27001: "ISO 27001",
  ISO27001_2022: "ISO 27001 (2022)",
  // ISO27001_2022_ANNEX_A: "ISO 27001 (2022 Annex A)",
  ISO27002: "ISO 27002",
  ISO9001: "ISO 9001",
  ISO45001: "ISO 45001",
  ISO14001: "ISO 14001",
  ISO15686_5: "ISO 15686-5",
  DSPTNHS: "DSPT",
  BS9997: "BS 9997",
  ESG_GOVERNANCE: "ESG Toolkit - Governance",
  ESG_SOCIAL: "ESG Toolkit - Social",
  ESG_ENVIRONMENTAL: "ESG Toolkit - Environmental",
};
