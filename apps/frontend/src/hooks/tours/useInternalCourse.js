import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useInternalCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Audit – Internal",
    description: "Schedule, amend and manage your Internal Audits.",
    steps: [
      {
        target: `[data-tour-step="audits-sidebar"]`,
        content: "Click on “Audits” in the sidebar.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="internal-audit"]`,
        content:
          "Click on “Internal” to view existing Internal Audits or schedule new ones.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="schedule-button"]`,
        content: "Click “Schedule” to schedule a new Internal Audit.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="audit-form"]`,
        content: "Fill in the relevant details here.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="interval-choice"]`,
        content:
          "Depending on your “Interval” choice, this will determine the number of Audits that will be automatically scheduled for the year ahead – “Quarterly” (Four), “Half yearly” (Two) or “Yearly” (One).",
        disableBeacon: true,
        placement: "left",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="audit-confirm-button"]`,
        content: "Click on “Confirm” to add the Audit(s) to the system.",
        disableBeacon: true,
        placement: "bottom",
        spotlightClicks: true,
      },

      {
        target: `[data-tour-step="audit-table"]`,
        content:
          "View the details of any Audit by clicking on the entry in the table, or on the “Actions” button and then on “Details”.",
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
      if (index === 1) {
        history.push("/admin/audits/internal");
        window.dispatchEvent(
          new CustomEvent("EXPAND_SIDEBAR_MENU", { detail: "Audits" }),
        );
      }

      if (
        index === 2 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();
        openDrawer("create-audit");
        setTimeout(() => {
          setCurrentStep(3);
          data.resumeTour();
        }, 500);
      }
      if (index === 6) {
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
