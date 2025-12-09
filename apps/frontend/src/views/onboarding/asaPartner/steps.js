import StepApplication from "./StepApplication";
import StepBasic from "./StepBasic";
export const steps = {
  "partnership-basic": {
    name: "Basic information",
    component: <StepBasic />,
  },
  "partnership-address": {
    name: "Application",
    component: <StepApplication />,
  },
};
