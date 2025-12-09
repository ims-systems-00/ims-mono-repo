import {
  ACTIONS,
  EFFECTS,
  IMS_SERVICES,
  LICENSES,
  ROLES,
} from "@/rolesAndPermissions";
import HandleSignature from "../document/Index";
import DocumentOverview from "./Analytics/DocumentOverview";
import AddSignee from "./RepoModals/AddSignee";
import DocAuthorizationPanel from "./RepoModals/DocAuthorizationPanel";
import RepositoriesTableIndex from "./RepositoriesTableIndex";
const routes = [
  {
    // collapse: true, // removed submenu, using direct component route
    name: "Documents",
    path: "/document-repositories",
    icon: "ims-icons-20 icon-icon-folder-24",
    accessPolicy: {
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.DOCUMENT_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
    component: RepositoriesTableIndex,
    layout: "/admin",
    screenIdentifier: "document-management-repository-list",
    /*
    views: [
      {
        path: "/document-repositories/overview",
        name: "Overview",
        mini: "O",
        icon: "ims-icons-20 icon-icon-notebook-24",
        component: RepositoryOverviewIndex,
        layout: "/admin",
        screenIdentifier: "document-management-overview",
        accessPolicy: {
          service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
          action: ACTIONS.READ,
          effect: EFFECTS.ALLOW,
        },
        authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
        authorisedLicense: {
          license: LICENSES.DOCUMENT_MANAGEMENT,
          type: LICENSES.TYPE.PARTNER,
        },
      },
      {
        path: "/document-repositories",
        name: "Repositories",
        mini: "O",
        icon: "ims-icons-20 icon-icon-foldersimple-24",
        component: RepositoriesTableIndex,
        layout: "/admin",
        screenIdentifier: "document-management-repository-list",
        accessPolicy: {
          service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
          action: ACTIONS.READ,
          effect: EFFECTS.ALLOW,
        },
        authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
        authorisedLicense: {
          license: LICENSES.DOCUMENT_MANAGEMENT,
          type: LICENSES.TYPE.PARTNER,
        },
      },
      {
        path: "/document-repositories/recycle-bin",
        name: "Recycle Bin",
        mini: "RB",
        icon: "ims-icons-20 icon-icon-trashsimple-24",
        component: DeletedRepositoriesTableIndex,
        layout: "/admin",
        screenIdentifier: "document-management-recycle-bin",
        accessPolicy: {
          service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
          action: ACTIONS.READ,
          effect: EFFECTS.ALLOW,
        },
        authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
        authorisedLicense: {
          license: LICENSES.DOCUMENT_MANAGEMENT,
          type: LICENSES.TYPE.PARTNER,
        },
      },
      {
        path: "/document-repositories/document-overview/:purpose",
        name: "Insight",
        mini: "O",
        icon: "ims-icons icon-icon-notebook-24",
        component: DocumentOverview,
        layout: "/admin",
        screenIdentifier: "document-management-overview",
        accessPolicy: {
          service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
          action: ACTIONS.READ,
          effect: EFFECTS.ALLOW,
        },
        invisible: true,
        authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
        authorisedLicense: {
          license: LICENSES.DOCUMENT_MANAGEMENT,
          type: LICENSES.TYPE.PARTNER,
        },
      },
    ],
    */
  },

  {
    path: "/document-repositories/document-overview/:purpose",
    name: "Insight",
    mini: "O",
    icon: "ims-icons icon-icon-notebook-24",
    component: DocumentOverview,
    layout: "/admin",
    screenIdentifier: "document-management-overview",
    accessPolicy: {
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    invisible: true,
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.DOCUMENT_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
  },
  {
    path: "/document-repositories/:id/nodes/:nodeId/signee",
    component: AddSignee,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "document-management-detail",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.DOCUMENT_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
    invisible: true,
  },
  {
    path: "/document-repositories/:id/nodes/:nodeId/signatures",
    component: HandleSignature,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "document-signature-detail",
    invisible: true,
  },
  {
    path: "/document-repositories/:id/nodes/:nodeId/authorisation",
    component: DocAuthorizationPanel,
    layout: "/admin",
    accessPolicy: {
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    screenIdentifier: "document-authorisation",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
    authorisedLicense: {
      license: LICENSES.DOCUMENT_MANAGEMENT,
      type: LICENSES.TYPE.PARTNER,
    },
    invisible: true,
  },
];

export default routes;
