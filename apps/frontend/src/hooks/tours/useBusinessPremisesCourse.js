import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";
export function useBusinessPremisesCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Our iMS – Business Premises ",
    description: "Navigate Business Premises and key metrics. ",
    steps: [
      {
        target: `[data-tour-step="our-ims-sidebar"]`,
        content: "Click on “Our iMS” in the sidebar.",
        // placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="business-premises-sidebar"]`,
        content:
          "Click on “Business Premises” to view existing premises or add new ones.",
        // placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="business-premises-button"]`,
        content: "Click on “Create premise” to add a new premise.",
        // placement: "left",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="business-premises-form"]`,
        content:
          "Fill in the relevant “Business units” that are currently using this premise followed by the “Name”, “Location” and “Address” of the premise.",
        disableBeacon: true,
        // placement: "bottom",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="business-premises-create"]`,
        content: "Click on “Create” to add the premise to the system.",
        disableBeacon: true,
        // placement: "bottom",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="business-premises-table"]`,
        content:
          "View the details of any Business Premise by clicking on the entry in the table, or on the “Actions” button and then on “Details”.",
        disableBeacon: true,
        // placement: "bottom",
        spotlightClicks: true,
      },
    ],
    callback: function (data) {
      const { type, status, index, setCurrentStep, action } = data;
      console.log("THE JOYRIDE CALLBACK DATA: ", data);

      if (type === EVENTS.STEP_AFTER && action !== ACTIONS.PREV) {
        setCurrentStep((prev) => prev + 1);
      }
      if (type === EVENTS.STEP_AFTER && action === ACTIONS.PREV) {
        setCurrentStep((prev) => prev - 1);
      }
      if (index === 1) {
        history.push("/admin/businesspremise");
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
        openDrawer("create-premise-drawer");
        setTimeout(() => {
          setCurrentStep(3);
          data.resumeTour();
        }, 500);
      }
      if (index === 5) {
        closeDrawer("create-premise-drawer");
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
