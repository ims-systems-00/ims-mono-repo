import { useNavigate } from "react-router-dom";
import CC_CONSTANTS from "../../constants";
import { STATUS, EVENTS, ACTIONS } from "react-joyride";

export function useFindCategories() {
  const navigate = useNavigate();
  const vistingCategory =
    CC_CONSTANTS.CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES;
  const course = {
    name: "How to Add Data",
    description:
      "Learn how to add data to the categories with simple and interactive steps.",
    steps: [
      {
        target: `[data-tour-step="sidebar-menu-item-categories"]`,
        content: "Find your calculations here.",
        // disableBeacon: true,
      },
      {
        target: `[data-tour-step="${vistingCategory}"]`,
        content: "This is where you can find all the categories.",
        // disableBeacon: true,
      },
      {
        target: `[data-tour-step="tile-category-opener"]`,
        content: "Open a category from here.",
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        // hideFooter: true,
        placement: "bottom",
        // spotlightClicks: true,
      },
      {
        target: `[data-tour-step="add-calculation-button"]`,
        content: "Add data from here.",
        disableBeacon: true,
      },
      {
        target: `[data-tour-step="calculation-data-table"]`,
        content: "All the emissions are listed here.",
        disableBeacon: true,
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

      if (index === 0) {
        navigate("/calculations/categories");
      }
      if (
        index === 2 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();

        navigate("/categories?category=" + vistingCategory);
        setTimeout(() => {
          setCurrentStep(3);
          data.resumeTour();
        }, 500);
      }

      if (
        index === 3 &&
        action === ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();

        navigate("/calculations/categories");
        setTimeout(() => {
          setCurrentStep(2);
          data.resumeTour();
        }, 500);
      }

      if (action === ACTIONS.SKIP || status === STATUS.FINISHED) {
        data.pauseTour();
        setCurrentStep(0);
      }
    },
  };
  return course;
}
