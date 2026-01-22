import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useBusinessUnitCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Business Units",
    description: "Learn how to add businees units",
    steps: [
      {
        target: `[data-tour-step="our-ims-sidebar"]`,
        content: "Click on Our iMS and select Business Units",
        placement: "bottom",
        disableBeacon: true,
        spotlightClicks: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        hideSkipButton: true,
      },
      {
        target: `[data-tour-step="create-business-unit-button"]`,
        content: "Click “create a function” to add a business unit.",
        placement: "right",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-business-unit-form"]`,
        content:
          "Fill in “Access type”, “ Compliance body”, “Standards” and “Responsibility”.",
        disableBeacon: true,
        placement: "left",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="business-unit-details"]`,
        content:
          "View the details of the created function by clicking “Actions – details”",
        placement: "top",
        spotlightClicks: true,
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="groups-table"]`,
        content: "Add and delete members in the “Business units” module.",
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

      if (index === 0) {
        history.push("/admin/groups");
      }
      if (
        index === 1 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();
        openDrawer("create-group-drawer");
        setTimeout(() => {
          setCurrentStep(2);
          data.resumeTour();
        }, 500);
      }
      if (index === 3) {
        closeDrawer("create-group-drawer");
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
