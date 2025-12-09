import CreateOrganisation from "./anOrganisation/Index.jsx";
import GoLive from "./goLive/Index.jsx";
import Partnershiprograme from "./asaPartner/Index";
import PartnershipGuide from "./asaPartner/PartnershipGuide";
import FlowSelection from "./flowSelection/Index";
import AccpetInvitation from "./accpetInvitaion/Index";

const routes = [
  {
    path: "/onboard/organisation",
    name: "Create organisation",
    invisible: true,
    component: CreateOrganisation,
    accessPolicy: {},
    layout: "/auth",
  },
  {
    path: "/onboard/flow-selection",
    name: "Select flow",
    invisible: true,
    component: FlowSelection,
    accessPolicy: {},
    layout: "/auth",
  },
  {
    path: "/onboard/go-live",
    name: "Partnership programe",
    invisible: true,
    component: GoLive,
    accessPolicy: {},
    layout: "/auth",
  },
  {
    path: "/onboard/partner",
    name: "Partnership programe",
    invisible: true,
    component: Partnershiprograme,
    accessPolicy: {},
    layout: "/auth",
  },
  {
    path: "/onboard/accept-invitaion/:token",
    name: "Partnership programe",
    invisible: true,
    component: AccpetInvitation,
    accessPolicy: {},
    layout: "/auth",
  },
  {
    path: "/onboard/partnership-setup-guide/",
    name: "Partnership setup ",
    invisible: true,
    component: PartnershipGuide,
    accessPolicy: {},
    layout: "/auth",
  },
];

export default routes;
