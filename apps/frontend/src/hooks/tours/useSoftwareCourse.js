import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useSoftwareCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Inventory – Software",
    description: "Add, amend and manage your Software Assets.",
    steps: [
      {
        target: `[data-tour-step="inventory-sidebar"]`,
        content: "Click on “Inventory” in the sidebar.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="inventory-software"]`,
        content:
          "Click on “Software” to view existing Software assets or add new ones.",
        // placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-software-asset-button"]`,
        content: "Click on “Add” to add a new Software Asset.",
        // placement: "right",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="create-software-asset-form"]`,
        content: "Fill in the relevant details here.",
        placement: "left",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="create-software-form-button"]`,
        content: "Click on “Create” to add the Asset to the system.",
        disableBeacon: true,
        // placement: "bottom",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-software-table"]`,
        content:
          "View the details of any Software Asset by clicking on the entry in the table, or on the “Actions” button and then on “Details”.",
        disableBeacon: true,
        // placement: "bottom",
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
        history.push("/admin/inventory/software");
        window.dispatchEvent(
          new CustomEvent("EXPAND_SIDEBAR_MENU", { detail: "Inventory" }),
        );
      }
      if (
        index === 2 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();
        openDrawer("create-software-asset-form");
        setTimeout(() => {
          setCurrentStep(3);
          data.resumeTour();
        }, 500);
      }
      if (index === 5) {
        closeDrawer("create-software-asset-form");
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
