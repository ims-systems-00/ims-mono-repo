const {
  IMS_POLICIES,
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
  ACCESS_SCOPE,
  ACCESS_POLICY_TYPE,
  POLICY_USAGE,
  GROUP_TYPE,
} = require("@ims-systems-00/ims-core/lib/constants");
const PolicyModel = require("../models/mongodb/system/ourIms/iamPolicy");
const Interface = require("./interfaces");
const IamGroup = require("../models/mongodb/system/ourIms/iamGroup");
const UserModel = require("../models/mongodb/system/users&auth/user");
const { asyncWrapper } = require("./utility");
const IamPolicyModel = require("../models/mongodb/system/ourIms/iamPolicy");
const IamRoleModel = require("../models/mongodb/system/ourIms/iamRole");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

class IamPolicyStatements extends Interface {
  constructor(connection) {
    super();
    this.connection = connection;
  }
  getStatements(toolResources) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve({
          imsSiteAdministrationPolicy: [
            {
              service: IMS_SERVICES.DASHBOARD,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.OUR_IMS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_GROUPS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ROLES,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_PREMISES,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ACCESS_POLICIES,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.SYSTEM_DEFAULTS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.LICENSE_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INVENTORY,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.RISK_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INCIDENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.AUDIT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.MANAGEMENT_REVIEW,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.KPI_OBJECTIVE,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CQC,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27001_2022,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27001_2022_ANNEX_A,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27002,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO20000,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO14001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO45001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO9001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.DSPTNHS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.BS9997,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO15686_5,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ESG_GOVERNANCE,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ESG_SOCIAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ESG_ENVIRONMENTAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.BUILDING_SAFETY_ACT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CRM,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.TASK_MANAGER,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CALENDAR,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.NOTIFICATIONS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.USERS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
          ],
          imsBusinessFunctionPolicy: [
            {
              service: IMS_SERVICES.DASHBOARD,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.OUR_IMS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_GROUPS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ROLES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_PREMISES,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.LICENSE_MANAGEMENT,
              actions: [ACTIONS.CREATE, ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INVENTORY,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.RISK_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INCIDENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.AUDIT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.MANAGEMENT_REVIEW,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.KPI_OBJECTIVE,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CQC,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27001_2022,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27001_2022_ANNEX_A,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27002,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO20000,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO14001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO45001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO9001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.DSPTNHS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.BS9997,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO15686_5,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ESG_GOVERNANCE,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ESG_SOCIAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ESG_ENVIRONMENTAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CRM,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.TASK_MANAGER,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CALENDAR,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.NOTIFICATIONS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.USERS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
          ],
          imsComplieanceBodyPolicy: [
            {
              service: IMS_SERVICES.DASHBOARD,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.OUR_IMS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_GROUPS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ROLES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_PREMISES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INVENTORY,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.RISK_MANAGEMENT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INCIDENT_MANAGEMENT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.AUDIT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.MANAGEMENT_REVIEW,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.KPI_OBJECTIVE,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CQC,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27001,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27001_2022,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27001_2022_ANNEX_A,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO27002,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO20000,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO14001,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO45001,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO9001,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.DSPTNHS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.BS9997,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ISO15686_5,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ESG_GOVERNANCE,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ESG_SOCIAL,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.ESG_ENVIRONMENTAL,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CRM,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.TASK_MANAGER,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.NOTIFICATIONS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.USERS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
          ],
          imsSuperAdminRolePolicy: [
            {
              service: IMS_SERVICES.DASHBOARD,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.OUR_IMS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_GROUPS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ROLES,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_PREMISES,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ACCESS_POLICIES,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.SYSTEM_DEFAULTS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.LICENSE_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INVENTORY,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.RISK_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INCIDENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.AUDIT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.MANAGEMENT_REVIEW,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.KPI_OBJECTIVE,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CQC,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022_ANNEX_A,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27002,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO20000,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO14001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO45001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO9001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.DSPTNHS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.BS9997,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO15686_5,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_GOVERNANCE,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_SOCIAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_ENVIRONMENTAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CRM,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.TASK_MANAGER,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CALENDAR,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.NOTIFICATIONS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.USERS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
          ],
          imsHosRolePolicy: [
            {
              service: IMS_SERVICES.DASHBOARD,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.OUR_IMS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_GROUPS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ROLES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_PREMISES,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.LICENSE_MANAGEMENT,
              actions: [ACTIONS.CREATE, ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.RISK_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INCIDENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INVENTORY,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.AUDIT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.MANAGEMENT_REVIEW,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.KPI_OBJECTIVE,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CQC,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022_ANNEX_A,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27002,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO20000,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO14001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO45001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO9001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.DSPTNHS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.BS9997,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO15686_5,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CRM,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.TASK_MANAGER,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CALENDAR,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.NOTIFICATIONS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.USERS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
          ],
          imsBasicRolePolicy: [
            {
              service: IMS_SERVICES.DASHBOARD,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.OUR_IMS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_GROUPS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ROLES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_PREMISES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INVENTORY,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.RISK_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INCIDENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.AUDIT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.MANAGEMENT_REVIEW,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CQC,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022_ANNEX_A,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27002,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO20000,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO14001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO45001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO9001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.DSPTNHS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.BS9997,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO15686_5,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_GOVERNANCE,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_SOCIAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_ENVIRONMENTAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CRM,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.TASK_MANAGER,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CALENDAR,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.NOTIFICATIONS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.USERS,
              actions: [ACTIONS.UPDATE, ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
          ],
          imsAuditorRolePolicy: [
            {
              service: IMS_SERVICES.DASHBOARD,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.OUR_IMS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_GROUPS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ROLES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_PREMISES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INVENTORY,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.RISK_MANAGEMENT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.INCIDENT_MANAGEMENT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.AUDIT,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.MANAGEMENT_REVIEW,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.KPI_OBJECTIVE,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CQC,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022_ANNEX_A,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27002,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO20000,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO14001,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO45001,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO9001,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.BS9997,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.DSPTNHS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO15686_5,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_GOVERNANCE,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_SOCIAL,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_ENVIRONMENTAL,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CRM,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.TASK_MANAGER,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.NOTIFICATIONS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.USERS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
          ],
          imsEssentialPolicy: [
            {
              service: IMS_SERVICES.DASHBOARD,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.OUR_IMS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_GROUPS,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_ROLES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.LICENSE_MANAGEMENT,
              actions: [ACTIONS.CREATE, ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.IAM_PREMISES,
              actions: [ACTIONS.READ],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.NOTIFICATIONS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.USERS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
            {
              service: IMS_SERVICES.CQC,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27001_2022_ANNEX_A,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO27002,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO20000,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO14001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO45001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO9001,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.DSPTNHS,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.BS9997,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ISO15686_5,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_GOVERNANCE,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_SOCIAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.ESG_ENVIRONMENTAL,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.CRM,
              actions: [ACTIONS.READ],
              effect: EFFECTS.BLOCK,
            },
            {
              service: IMS_SERVICES.TASK_MANAGER,
              actions: [ACTIONS.ALL],
              effect: EFFECTS.ALLOW,
            },
          ],
        });
      } catch (err) {
        logger.info(err);
        reject(err);
      }
    });
  }
}

class IamPolicy extends Interface {
  constructor(connection) {
    super();
    this.connection = connection;
    this.User = UserModel(connection);
    this.Organization =
      require("../models/mongodb/system/organization/organization")(connection);
    this.Group = IamGroup(connection);
    this.Policy = IamPolicyModel(connection);
    this.Role = IamRoleModel(connection);
  }
  async _buildPolicy() {
    let iamPolicyStatements = new IamPolicyStatements(this.connection);
    let statements = await iamPolicyStatements.getStatements();
    return {
      imsSiteAdministrationPolicy: {
        name: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION,
        usedFor: POLICY_USAGE.BUSINESS_UNIT,
        type: ACCESS_POLICY_TYPE.IMS_MANAGED,
        accessScope: ACCESS_SCOPE.ALL_BUSINESS_UNIT,
        statement: statements.imsSiteAdministrationPolicy,
      },
      imsBusinessFunctionPolicy: {
        name: IMS_POLICIES.IMS_BUSINESS_FUNCTION,
        usedFor: POLICY_USAGE.BUSINESS_UNIT,
        type: ACCESS_POLICY_TYPE.IMS_MANAGED,
        accessScope: ACCESS_SCOPE.SINGLE_BUSINESS_UNIT,
        statement: statements.imsBusinessFunctionPolicy,
      },
      imsComplieanceBodyPolicy: {
        name: IMS_POLICIES.IMS_COMPLIANCE_FUNCTION,
        usedFor: POLICY_USAGE.BUSINESS_UNIT,
        type: ACCESS_POLICY_TYPE.IMS_MANAGED,
        accessScope: ACCESS_SCOPE.ALL_BUSINESS_UNIT,
        statement: statements.imsComplieanceBodyPolicy,
      },
      imsSuperAdminUserPolicy: {
        name: IMS_POLICIES.IMS_SUPER_ADMIN_USER,
        usedFor: POLICY_USAGE.ROLES,
        type: ACCESS_POLICY_TYPE.IMS_MANAGED,
        accessScope: ACCESS_SCOPE.ALL_BUSINESS_UNIT,
        statement: statements.imsSuperAdminRolePolicy,
      },
      imsHosUserPolicy: {
        name: IMS_POLICIES.IMS_HOS_USER,
        usedFor: POLICY_USAGE.ROLES,
        type: ACCESS_POLICY_TYPE.IMS_MANAGED,
        accessScope: ACCESS_SCOPE.SINGLE_BUSINESS_UNIT,
        statement: statements.imsHosRolePolicy,
      },
      imsBasicUserPolicy: {
        name: IMS_POLICIES.IMS_BASIC_USER,
        usedFor: POLICY_USAGE.ROLES,
        type: ACCESS_POLICY_TYPE.IMS_MANAGED,
        accessScope: ACCESS_SCOPE.SINGLE_BUSINESS_UNIT,
        statement: statements.imsBasicRolePolicy,
      },
      imsAuditorUserPolicy: {
        name: IMS_POLICIES.IMS_AUDITOR_USER,
        usedFor: POLICY_USAGE.ROLES,
        type: ACCESS_POLICY_TYPE.IMS_MANAGED,
        accessScope: ACCESS_SCOPE.ALL_BUSINESS_UNIT,
        statement: statements.imsAuditorRolePolicy,
      },
    };
  }
  async createPolicy(policy) {
    let policies = await this._buildPolicy();
    try {
      switch (policy.builderName) {
        case IMS_POLICIES.IMS_BUSINESS_FUNCTION:
          return this._savePolicy(policies.imsBusinessFunctionPolicy);
        case IMS_POLICIES.IMS_COMPLIANCE_FUNCTION:
          return this._savePolicy(policies.imsComplieanceBodyPolicy);
        case IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION:
          return this._savePolicy(policies.imsSiteAdministrationPolicy);
        case IMS_POLICIES.IMS_SUPER_ADMIN_USER:
          return this._savePolicy(policies.imsSuperAdminUserPolicy);
        case IMS_POLICIES.IMS_HOS_USER:
          return this._savePolicy(policies.imsHosUserPolicy);
        case IMS_POLICIES.IMS_BASIC_USER:
          return this._savePolicy(policies.imsBasicUserPolicy);
        case IMS_POLICIES.IMS_AUDITOR_USER:
          return this._savePolicy(policies.imsAuditorUserPolicy);
        case IMS_POLICIES.CUSTOM_FUNCTION:
          return this._savePolicy(policy.structure);
        default:
          return null;
      }
    } catch (err) {
      logger.info(err);
    }
  }

  _savePolicy(policy) {
    return new Promise(async (resolve, reject) => {
      try {
        let Policy = PolicyModel(this.connection);
        let createdPolicy = new Policy(policy);
        await createdPolicy.save();
        resolve(createdPolicy);
      } catch (err) {
        reject(err);
      }
    });
  }
  _removePolicy(policyId) {
    return new Promise(async (resolve, reject) => {
      try {
        let Policy = PolicyModel(this.connection);
        let createdPolicy = await Policy.findOneAndDelete({ _id: policyId });
        resolve(createdPolicy);
      } catch (err) {
        reject(err);
      }
    });
  }
  deletePolicy(policyId) {
    return this._removePolicy(policyId);
  }
  _isObject(object) {
    return object !== null && typeof object === "object";
  }
  _deepEqual(referenceObject, testObject) {
    const referenceKeys = Object.keys(referenceObject);
    const testKeys = Object.keys(testObject);
    if (referenceKeys.length !== testKeys.length) return false;
    for (const key of referenceKeys) {
      const referenceValue = referenceObject[key];
      const testValue = testObject[key];
      const hasProperties = _isObject(referenceValue);
      if (hasProperties && !this._deepEqual(referenceValue, testValue))
        return false;
    }
    return true;
  }
  _actionPriotiyCheck(minimumAction, actions = []) {
    let priorityMap = {
      [ACTIONS.ALL]: 5,
      [ACTIONS.CREATE]: 4,
      [ACTIONS.DELETE]: 3,
      [ACTIONS.UPDATE]: 2,
      [ACTIONS.READ]: 1,
    };
    for (let action of actions)
      if (priorityMap[action] >= priorityMap[minimumAction]) return true;
    return false;
  }
  validate(policyReference, policyToBeVarified) {
    for (let statement of policyReference.statement) {
      if (
        statement.service === policyToBeVarified.service &&
        this._actionPriotiyCheck(
          policyToBeVarified.action,
          statement.actions
        ) &&
        statement.effect === policyToBeVarified.effect
      ) {
        return true;
      }
    }
    return false;
  }
  isInternalAccess(group) {
    return group.type === GROUP_TYPE.INTERNAL;
  }
  isExternalAccess(group) {
    return group.type === GROUP_TYPE.EXTERNAL;
  }
  isSuperUser(groupPolicy, rolePolicy) {
    if (
      this.validateSuperUser(groupPolicy) &&
      this.validateSuperUser(rolePolicy)
    )
      return true;
    else return false;
  }
  validateSuperUser(policy) {
    return (
      policy.name === IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION ||
      policy.name === IMS_POLICIES.IMS_SUPER_ADMIN_USER
    );
  }
  validateGlobalAccess(policy) {
    return policy && policy.accessScope === ACCESS_SCOPE.ALL_BUSINESS_UNIT;
  }
  initializeComlianceToolAccess(tool) {
    return new Promise(async (resolve, reject) => {
      let [policies, policiesError] = await asyncWrapper(() =>
        Promise.all([
          this.Policy.findOne({ name: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION }),
          this.Policy.findOne({ name: IMS_POLICIES.IMS_COMPLIANCE_FUNCTION }),
        ])
      );
      let [siteAdministrationPolicy, complianceFunctionPolicy] = policies;
      let [groups, groupsError] = await asyncWrapper(() =>
        this.Group.find({
          policy: {
            $in: [siteAdministrationPolicy._id, complianceFunctionPolicy._id],
          },
        })
      );
      let [memberPolicies, memeberPoliciesError] = await asyncWrapper(() =>
        Promise.all(
          groups.map((group) => this.grantComlianceToolAccess(group._id, tool))
        )
      );
      if (memeberPoliciesError) return reject(memeberPoliciesError);
      resolve(memberPolicies);
    });
  }
  grantComlianceToolAccess(groupId, tool) {
    return new Promise(async (resolve, reject) => {
      let [group, groupError] = await asyncWrapper(() =>
        this.Group.findOne({
          _id: groupId,
          "userLicenses.complianceTools": tool,
        })
      );
      if (groupError) return [group, groupError];
      let [users, userError] = await asyncWrapper(() =>
        this.User.find({ "accessPolicies.group": groupId })
          .select({ accessPolicies: { $elemMatch: { group: groupId } } })
          .populate([])
          .exec()
      );
      logger.info({
        group: group,
        role: [users.map((user) => user.accessPolicies[0].role)],
      });
      if (userError) return [users, userError];
      let query = group
        ? { $set: { "statement.$[inner].effect": EFFECTS.ALLOW } }
        : { $set: { "statement.$[inner].effect": EFFECTS.BLOCK } };
      let [policies, policiesError] = await asyncWrapper(() =>
        Promise.all(
          users.map((user) =>
            this.Policy.findOneAndUpdate(
              { _id: user.accessPolicies[0].role.policy },
              query,
              {
                arrayFilters: [{ "inner.service": tool }],
                new: true,
              }
            )
          )
        )
      );
      if (policiesError) return reject(policiesError);
      resolve(policies);
    });
  }
  greantCqcAccess(policyId, effect) {
    return new Promise(async (resolve, reject) => {
      try {
        let Policy = PolicyModel(this.connection);
        let policy = await Policy.findOneAndUpdate(
          { _id: policyId },
          {
            $set: { "statement.$[inner].effect": effect },
          },
          {
            arrayFilters: [{ "inner.service": IMS_SERVICES.CQC }],
            new: true,
          }
        );
        resolve(policy);
      } catch (err) {
        reject(err);
      }
    });
  }
  async initializeDefaults() {
    try {
      await Promise.all([
        this.createPolicy({ builderName: IMS_POLICIES.IMS_BUSINESS_FUNCTION }),
        this.createPolicy({
          builderName: IMS_POLICIES.IMS_COMPLIANCE_FUNCTION,
        }),
      ]);
    } catch (err) {
      logger.info(err);
    }
  }
}
exports.IamPolicy = IamPolicy;

exports.IamPolicyStatements = IamPolicyStatements;
