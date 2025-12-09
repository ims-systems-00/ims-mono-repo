import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";

export function useBusinessUnitCourse() {
  const history = useHistory();

  const course = {
    name: "Business Units",
    description: "Learn how to add businees units",
    steps: [
      {
        target: `[data-tour-step="our-ims"]`,
        content:
          "Open the Our IMS menu",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        hideSkipButton: true,
      },
      {
        target: `[data-tour-step="business-units"]`,
        content:
          "Find all the business units that you have access to.",
        placement: "right",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-group"]`,
        content:
          "Click here to create a new group.",
        disableBeacon: true,
        placement: "right",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="groups-table"]`,
        content:
          "All the groups list are here.",
        placement: "top",
        spotlightClicks: true,
        disableBeacon: true,
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
        history.push("/admin/groups");
      }

      if (action === ACTIONS.SKIP || status === STATUS.FINISHED) {
        data.pauseTour();
        setCurrentStep(0);
      }
    },
  };

  return course;
}
