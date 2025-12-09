import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";

export function useBusinessPremisesCourse() {
  const history = useHistory();

  const course = {
    name: "Business Premises",
    description: "Learn how to add business premises",
    steps: [
      {
        target: `[data-tour-step="our-ims"]`,
        content: "Open the Our IMS menu",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="business-premises"]`,
        content: "Find all the business premises that you have access to.",
        placement: "right",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-business-premise"]`,
        content: "Click here to create a new business premise.",
        disableBeacon: true,
        placement: "bottom",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="business-premises-table"]`,
        content: "All the business premises list are here.",
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
        history.push("/admin/businesspremise");
      }
      if (action === ACTIONS.SKIP || status === STATUS.FINISHED) {
        data.pauseTour();
        setCurrentStep(0);
      }
    },
  };

  return course;
}
