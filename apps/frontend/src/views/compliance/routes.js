import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import ClauseDetail from "./ClauseDetail";
import BS9997Management from "./bs9997/BS9997Management";
import DsptManagement from "./dspt/DsptManagement";
import ESGManagement from "./esg/ESGManagement";
import Iso14001Management from "./iso14001/Iso14001Management";
import Iso15686Management from "./iso15686/Iso15686Management";
import Iso20000Management from "./iso20000/Iso20000Management";
import iso27001Management from "./iso27001/iso27001Management";
import Iso27001_2022Management from "./iso27001_2022/Iso27001_2022Management";
import Iso_27001_Annex_AManagement from "./iso27001_Annex_A/Iso_27001_Annex_AManagement";
import Iso27002Management from "./iso27002/Iso27002Management";
import Iso45001Management from "./iso45001/Iso45001Management";
import Iso9001Management from "./iso9001/Iso9001Management";
import buildingSafetyActManagement from "./building_safety_act/buildingSafetyActManagement";

const routes = [
  {
    collapse: true,
    name: "Compliance",
    icon: "ims-icons-20 icon-icon-shieldcheck-24",
    accessPolicy: {
      service: IMS_SERVICES.COMPLIANCE_TOOL,
      action: ACTIONS.READ,
    },
    state: "isoCollapse",
    views: [
      {
        path: "/iso14001",
        name: "ISO 14001 (2015)",
        mini: "I",
        icon: "ims-icons icon-icon-stack-24",
        component: Iso14001Management,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ISO14001,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-iso14001",
      },
      {
        path: "/iso15686",
        name: "ISO 15686-5 (2017)",
        mini: "I",
        icon: "ims-icons icon-icon-stack-24",
        component: Iso15686Management,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ISO15686_5,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-iso15686",
      },
      {
        path: "/iso20000",
        name: "ISO 20000 (2018)",
        mini: "I",
        icon: "ims-icons icon-icon-stack-24",
        component: Iso20000Management,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ISO20000,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-iso20000",
      },
      {
        path: "/iso27001",
        name: "ISO 27001 (2013)",
        mini: "I",
        icon: "ims-icons icon-icon-stack-24",
        component: iso27001Management,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ISO27001,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-iso27001",
      },
      {
        path: "/iso27001-2022",
        name: "ISO 27001 (2022)",
        mini: "I",
        icon: "ims-icons icon-icon-stack-24",
        component: Iso27001_2022Management,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ISO27001_2022,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-iso27001-2022",
      },
      {
        path: "/iso27001-2022-annex-a",
        name: "ISO 27001 (2022 Annex A)",
        mini: "I",
        icon: "ims-icons icon-icon-stack-24",
        component: Iso_27001_Annex_AManagement,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ISO27001_2022_ANNEX_A,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-iso27001-2022-annex-a",
      },
      {
        path: "/iso27002",
        name: "ISO 27002 (2013)",
        mini: "I",
        icon: "ims-icons icon-icon-stack-24",
        component: Iso27002Management,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ISO27002,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-iso27002",
      },
      {
        path: "/iso9001",
        name: "ISO 9001 (2015)",
        mini: "I",
        icon: "ims-icons icon-icon-stack-24",
        component: Iso9001Management,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ISO9001,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-iso9001",
      },
      {
        path: "/iso45001",
        name: "ISO 45001 (2018)",
        mini: "I",
        icon: "ims-icons icon-icon-stack-24",
        component: Iso45001Management,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ISO45001,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-iso45001",
      },
      {
        path: "/dspt",
        name: "DSPT (2022)",
        mini: "D",
        icon: "ims-icons icon-icon-stack-24",
        component: DsptManagement,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.DSPTNHS,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-dspt-nhs",
      },
      {
        path: "/bs9997",
        name: "BS 9997 (2019)",
        mini: "B",
        icon: "ims-icons icon-icon-stack-24",
        component: BS9997Management,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.BS9997,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-bs9997",
      },
      {
        path: "/esg",
        name: "ESG",
        mini: "E",
        icon: "ims-icons icon-icon-stack-24",
        component: ESGManagement,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.ESG_GOVERNANCE,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-bs9997",
      },
      // Building Safety Act
      {
        path: "/building-safety-act",
        name: "Building Safety Act",
        mini: "B",
        icon: "ims-icons icon-icon-stack-24",
        component: buildingSafetyActManagement,
        layout: "/admin",
        licenseRequirements: {
          complianceTool: IMS_SERVICES.BUILDING_SAFETY_ACT,
        },
        accessPolicy: {
          service: IMS_SERVICES.COMPLIANCE_TOOL,
          action: ACTIONS.READ,
        },
        screenIdentifier: "compliance-tool-building-safety",
      },
    ],
  },
  {
    path: "/controls/:id",
    component: ClauseDetail,
    layout: "/admin",
    screenIdentifier: "control-status",
    accessPolicy: {
      service: IMS_SERVICES.COMPLIANCE_TOOL,
      action: ACTIONS.READ,
    },
    screenIdentifier: "control-status-detail",
    invisible: true,
  },
];

export default routes;
