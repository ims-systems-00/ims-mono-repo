import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useCreateRepositoriesCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Create Repositories",
    description: "A quick walkthrough to create and manage repositories.",
    steps: [
      {
        target: `[data-tour-step="document-management-repository-list"]`,
        content: "Open the Documents section from the sidebar to get started.",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repositories-table-tab"]`,
        content: "Click on the Repositories tab to view the repositories.",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repository-table"]`,
        content: "This is the repository table.",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="create-repository-button"]`,
        content: "Click here open the repository creation form.",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repository-form"]`,
        content: "Fill in the required fields to create a new repository.",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repository-form-button"]`,
        content: "Click here to create the repository.",
        disableBeacon: true,
        spotlightClicks: true,
      },
    ],
    callback: function (data) {
      let { type, status, index, setCurrentStep, action, lifecycle } = data;
      if (type === EVENTS.STEP_AFTER && action !== ACTIONS.PREV) {
        setCurrentStep((prev) => prev + 1);
      }
      if (type === EVENTS.STEP_AFTER && action === ACTIONS.PREV) {
        setCurrentStep((prev) => prev - 1);
      }

      if (action === ACTIONS.SKIP) {
        data.pauseTour();
        setCurrentStep(0);
      }
      if (status === STATUS.FINISHED) {
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
