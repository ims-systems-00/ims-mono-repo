import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useIncidentsCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Incidents",
    description: "Raise, amend and manage your Incidents.",
    steps: [
      {
        target: `[data-tour-step="incident-management"]`,
        content:
          "Click on “Incidents” in the sidebar to view existing Incidents or raise new ones.",
        placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-incident-button"]`,
        content: "Click “Raise” to raise a new Incident.",
        // placement: "right",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
      },
      {
        target: `[data-tour-step="create-incident-form"]`,
        content: "Fill in the relevant details here.",
        placement: "left",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="raise-incident-form-button"]`,
        content: "Click on “Raise incident” to add the Incident to the system.",
        disableBeacon: true,
        // placement: "bottom",
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-incident-table"]`,
        content:
          "View the details of any Incident by clicking on the entry in the table, or on the “Actions” button and then on “Details”.",
        disableBeacon: true,
        // placement: "left",
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
        history.push("/admin/incidentmanagement");
      }
      if (
        index === 1 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();
        openDrawer("create-incident");
        for (let i = 0; i < 1000000000; i++);
        data.resumeTour();
      }
      if (index === 4) {
        closeDrawer("create-incident");
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
