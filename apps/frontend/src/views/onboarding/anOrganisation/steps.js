import StepAddress from "./StepAddress";
import StepBasic from "./StepBasic";
import StepConfirmCreate from "./StepConfirmCreate";
import StepLogo from "./StepLogo";
import StepPartnerCode from "./StepPartnerCode";
export const steps = {
  "org-basic": {
    name: "Organisation",
    component: <StepBasic />,
  },
  "org-address": {
    name: "Address",
    component: <StepAddress />,
  },
  "org-logo": {
    name: "Logo",
    component: <StepLogo />,
  },
  "org-partner-code": {
    name: "Partner code",
    component: <StepPartnerCode />,
  },
  "org-create": {
    name: "Create organisation",
    component: <StepConfirmCreate />,
  },
};
