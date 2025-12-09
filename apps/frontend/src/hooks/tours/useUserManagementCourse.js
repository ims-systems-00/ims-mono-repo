import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";

export function useUserManagementCourse() {
  const history = useHistory();

  const course = {
    steps: [
      {
        target: `[data-tour-step="our-ims"]`,
        content:
          "Open the menu and click on Users.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="users"]`,
        content:
          "Find all the users that you have access to.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="create-user"]`,
        content:
          "Click here to create a new user.",
        disableBeacon: true,
        placement: "bottom",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="users-table"]`,
        content:
          "All the users list are here.",
        placement: "top",
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
        history.push("/admin/users");
      }
      if (action === ACTIONS.SKIP || status === STATUS.FINISHED) {
        data.pauseTour();
        setCurrentStep(0);
      }
    },
  };

  return course;
}
