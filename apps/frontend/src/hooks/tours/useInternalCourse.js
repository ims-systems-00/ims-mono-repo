import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useInternalCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Audit – Internal",
    description: "A quick walkthrough to create and manage repositories.",
    steps: [
      {
        target: `[data-tour-step="audits-sidebar"]`,
        content: "Click Audits and select Internal.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="schedule-button"]`,
        content: "Click “Schedule” to schedule an internal audit.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="audit-form"]`,
        content:
          "Fill in Audit, focus area. Select a date and time and time interval for the audit.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="select-auditor"]`,
        content:
          "The “auditor” allows you to choose a person to perform this audit.",
        disableBeacon: true,
        placement: "bottom",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="audit-table"]`,
        content:
          "Several more audits are automatically created based on the time interval for the audit.",
        disableBeacon: true,
        placement: "bottom",
        spotlightClicks: true,
      },

      {
        target: `[data-tour-step="audit-action"]`,
        content: "Click “action” to view the details of the internal audit.",
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
        history.push("/admin/audits/internal");
      }
      if (
        index === 1 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();
        openDrawer("create-audit");
        setTimeout(() => {
          setCurrentStep(2);
          data.resumeTour();
        }, 500);
      }
      if (index === 4) {
        closeDrawer("create-audit");
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
