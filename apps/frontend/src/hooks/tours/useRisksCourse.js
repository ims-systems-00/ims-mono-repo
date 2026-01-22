import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useRisksCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Risks",
    description: "A quick walkthrough to create and manage repositories.",
    steps: [
      {
        target: `[data-tour-step="risk-management"]`,
        content: "Click on Risks",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-risk-button"]`,
        content: "Click “Raise” to report a new risk.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-risk-form"]`,
        content:
          "Provide information for risk title, type, risk owner, likelihood and consequence.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="create-risk-action"]`,
        content:
          "View the details of the newly-raised risk by clicking “action - details”.",
        disableBeacon: true,
        placement: "bottom",
        spotlightClicks: true,
      },
    ],
    callback: function (data) {
      const { type, status, index, setCurrentStep, action } = data;
      if (type === EVENTS.STEP_AFTER && action !== ACTIONS.PREV) {
        setCurrentStep((prev) => prev + 1);
      }
      if (type === EVENTS.STEP_AFTER && action === ACTIONS.PREV) {
        setCurrentStep((prev) => prev - 1);
      }
      if (index === 0) {
        history.push("/admin/risks");
      }
      if (
        index === 1 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        // data.pauseTour();
        openDrawer("create-risk");
        // setTimeout(() => {
        //   setCurrentStep(2);
        //   data.resumeTour();
        // }, 500);
      }
      if (index === 3) {
        closeDrawer("create-risk");
      }
      if (action === ACTIONS.SKIP || status === STATUS.FINISHED) {
        data.pauseTour();
        setCurrentStep(0);
      }
      if (status === STATUS.FINISHED) {
        data.pauseTour();
        history.push("/admin/guidelines");
        setCurrentStep(0);
      }
    },
  };

  return course;
}
