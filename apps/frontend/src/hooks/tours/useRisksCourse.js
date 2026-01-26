import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useRisksCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Risks",
    description: "Raise, amend and manage your Risks.",
    steps: [
      {
        target: `[data-tour-step="risk-management"]`,
        content:
          "Click on “Risks” in the sidebar to view existing Risks or raise new ones.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-risk-button"]`,
        content: "Click “Raise” to raise a new Risk.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-risk-form"]`,
        content: "Fill in the relevant details here.",
        placement: "left",
        disableBeacon: true,
      },

      {
        target: `[data-tour-step="raise-risk-button"]`,
        content: "Click on “Raise risk” to add the Risk to the system.",
        placement: "top",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="create-risk-table"]`,
        content:
          "View the details of any Risk by clicking on the entry in the table, or on the “Actions” button and then on “Details”.",
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
        data.pauseTour();
        openDrawer("create-risk");
        for (let i = 0; i < 1000000000; i++);
        data.resumeTour();
        // setTimeout(() => {
        //   setCurrentStep(2);
        // }, 500);
      }
      if (index === 4) {
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
