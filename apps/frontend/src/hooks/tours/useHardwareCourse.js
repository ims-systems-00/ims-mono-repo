import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";
import { set } from "date-fns";

export function useHardwareCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Inventory – Hardware",
    description: "A quick walkthrough to create and manage repositories.",
    steps: [
      {
        target: `[data-tour-step="inventory-sidebar"]`,
        content: "Click on Inventory and select Hardware.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-hardware-button"]`,
        content: "Click on “Add” to add a new hardware.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-hardware-form"]`,
        content: "Fill in “asset name”, “asset type” and select “owner”.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="create-hardware-dates"]`,
        content:
          "Assigned date, Destruction date and Return date give you important dates of this asset.",
        disableBeacon: true,
        placement: "bottom",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-hardware-action"]`,
        content:
          "View the details of this asset by clicking “action - details”.",
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
        history.push("/admin/inventory/hardware");
      }
      if (
        index === 1 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();
        openDrawer("create-hardware-asset");
        setTimeout(() => {
          setCurrentStep(2);
          data.resumeTour();
        }, 500);
      }
      if (index === 4) {
        closeDrawer("create-hardware-asset");
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
