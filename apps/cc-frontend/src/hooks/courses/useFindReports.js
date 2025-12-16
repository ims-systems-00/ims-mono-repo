import { useNavigate } from "react-router-dom";
import { STATUS, EVENTS, ACTIONS } from "react-joyride";

export function useFindReports() {
  const navigate = useNavigate();

  const course = {
    name: "How to Find Report",
    description: "Learn how to find report with simple and interactive steps.",
    steps: [
      {
        target: `[data-tour-step="sidebar-menu-item-reports"]`,
        content: "Find your reports here.",
      },

      {
        target: `[data-tour-step="iso-14064-full-report"]`,
        content: "Open a report from here.",
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        placement: "bottom",
      },
      {
        target: `[data-tour-step="select-year-of-report"]`,
        content: "Select a year from here.",
        disableBeacon: true,
      },
    ],
    callback: function (data) {
      let { type, status, index, setCurrentStep, action, lifecycle } = data;

      if (type === EVENTS.STEP_AFTER && action !== ACTIONS.PREV) {
        setCurrentStep((prev) => prev + 1);
      }
      if (type === EVENTS.STEP_AFTER && action === ACTIONS.PREV) {
        setCurrentStep((prev) => prev - 1);
      }

      if (index === 0) {
        navigate("/reports");
      }
      if (
        index === 1 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();

        navigate("/iso-14064-full-report");
        setTimeout(() => {
          setCurrentStep(2);
          data.resumeTour();
        }, 3000);
      }

      if (action === ACTIONS.SKIP || status === STATUS.FINISHED) {
        data.pauseTour();
        setCurrentStep(0);
      }
    },
  };
  return course;
}
