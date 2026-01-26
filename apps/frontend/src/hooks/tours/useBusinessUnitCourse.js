import { useRef, useEffect } from "react";
import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

export function useBusinessUnitCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Our iMS – Business units ",
    description: "Create, edit, and manage Business Units in the system. ",
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
        target: `[data-tour-step="business-unit-sidebar"]`,
        content:
          "Click on “Business Units” to view existing Business Units or add new ones.",
        placement: "right",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="create-business-unit-button"]`,
        content: "Click on “Create a function” to add a Business Unit.",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="business-unit-access-type"]`,
        content: "Select the relevant “Access type” for your Business Unit. ",
        spotlightClicks: false,
        disableBeacon: true,
        hideFooter: true,
      },
      {
        target: `[data-tour-step="business-unit-relevant-info"]`,
        content: "Fill in the fields with their relevant information.",
        spotlightClicks: true,
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="business-unit-create-button"]`,
        content:
          "Click on “Create” to add the Business Unit to your organisation.",
        spotlightClicks: true,
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="groups-table"]`,
        content:
          "View the details of any created Business Unit by clicking on the entry in the table, or on the “Actions” button and then on “Details”. ",
        spotlightClicks: true,
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="business-unit-details"]`,
        content: "You can add and delete members here.",
        spotlightClicks: true,
        disableBeacon: true,
      },
    ],
    callback: function (data) {
      const { type, status, index, setCurrentStep, action } = data;
      localStorage.setItem("isTutorialMode", "true");
      if (type === EVENTS.STEP_AFTER && action !== ACTIONS.PREV) {
        setCurrentStep((prev) => prev + 1);
      }
      if (type === EVENTS.STEP_AFTER && action === ACTIONS.PREV) {
        setCurrentStep((prev) => prev - 1);
      }

      if (index === 1) {
        history.push("/admin/groups");
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
        openDrawer("create-group-drawer");
        setTimeout(() => {
          setCurrentStep(3);
          data.resumeTour();
        }, 500);
      }
      if (index === 6) {
        closeDrawer("create-group-drawer");
      }

      if (action === ACTIONS.SKIP || status === STATUS.FINISHED) {
        localStorage.removeItem("isTutorialMode");
        data.pauseTour();
        setCurrentStep(0);
      }
      if (status === STATUS.FINISHED) {
        localStorage.removeItem("isTutorialMode");
        data.pauseTour();
        history.push("/admin/guidelines");
        setCurrentStep(0);
      }
    },
  };

  return course;
}
