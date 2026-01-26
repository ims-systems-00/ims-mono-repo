import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useUserManagementCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Our iMS – Users ",
    description: "Add, track and manage your Users. ",
    steps: [
      {
        target: `[data-tour-step="our-ims-sidebar"]`,
        content: "Click on “Our iMS” in the sidebar.",
        placement: "right",
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        hideSkipButton: true,
      },
      {
        target: `[data-tour-step="our-ims-users"]`,
        content: "Click on “Users” to view existing Users or add new ones.",
        placement: "right",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-user-button"]`,
        content: "Click on “Add user” to add a new User.",
        disableBeacon: true,
        // placement: "left",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-user-form"]`,
        content: "Fill in the email and role of the new User.",
        // placement: "top",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-user-confirm"]`,
        content: "Click on “Confirm” to send the User an invite to the system.",
        // placement: "top",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="users-table"]`,
        content:
          "View the details of any User by clicking on the entry in the table, or on the “Actions” button and then on “Details”.",
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

      if (index === 1) {
        history.push("/admin/users");
        window.dispatchEvent(
          new CustomEvent("EXPAND_SIDEBAR_MENU", { detail: "Our iMS" }),
        );
      }
      if (
        index === 2 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();
        openDrawer("create-user");
        for (let i = 0; i < 1000000000; i++);
        data.resumeTour();
      }
      if (index === 5) {
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
