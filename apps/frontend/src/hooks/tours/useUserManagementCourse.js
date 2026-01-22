import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useUserManagementCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Our iMS – Users",
    description: "A quick walkthrough to create and manage repositories.",
    steps: [
      {
        target: `[data-tour-step="our-ims-sidebar"]`,
        content: "Click on Our iMS and select Users to view existing users.",
        // placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-user-button"]`,
        content: "Click on “add user” to add a new user.",
        // placement: "auto",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-user-form"]`,
        content: "Fill in the email and role of the new user",
        disableBeacon: true,
        // placement: "left",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="users-table-action"]`,
        content: "View the details of the users by clicking “action - details”",
        // placement: "top",
        disableBeacon: true,
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
        history.push("/admin/users");
      }
      if (
        index === 1 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        // data.pauseTour();
        openDrawer("create-user");
        // setTimeout(() => {
        //   setCurrentStep(2);
        //   data.resumeTour();
        // }, 1000);
      }
      if (index === 3) {
        closeDrawer("create-user");
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
