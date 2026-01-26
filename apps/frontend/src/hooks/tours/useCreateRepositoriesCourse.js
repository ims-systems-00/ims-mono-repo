import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  skipProps,
  primaryProps,
  tooltipProps,
}) => (
  <div
    {...tooltipProps}
    style={{
      backgroundColor: "#fff",
      padding: "16px",
      borderRadius: "12px",
      minWidth: "360px",
      maxWidth: "400px",
      marginTop: "100px",
      marginLeft: "320px",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "0",
        height: "0",
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderBottom: "10px solid #fff",
      }}
    />
    {step.title && <h2>{step.title}</h2>}
    <div style={{ padding: "10px 0" }}>{step.content}</div>
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
    >
      <button
        {...closeProps}
        style={{
          padding: "0px 0px",
          color: "#000",
          border: "none",
          backgroundColor: "transparent",
          fontWeight: "bold",
        }}
      >
        Skip
      </button>
      <button
        {...primaryProps}
        style={{
          backgroundColor: "#ffffff",
          color: "#28a745",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Next
      </button>
    </div>
  </div>
);

export function useCreateRepositoriesCourse() {
  const history = useHistory();
  const { openDrawer, closeDrawer } = useDrawer();

  const course = {
    name: "Document Management – Repository ",
    description: "Create and manage your Document Repositories. ",
    steps: [
      {
        target: `[data-tour-step="document-management-repository-list"]`,
        content: "Click on “Documents” in the sidebar.",
        disableBeacon: true,
        // spotlightClicks: true,
        placement: "right",
      },
      {
        target: `[data-tour-step="repositories-table-tab"]`,
        content:
          "Click on “Repositories” to view existing premises or add new ones.",
        disableBeacon: true,
        placement: "left",
        styles: {
          options: {
            arrowColor: "transparent",
          },
          arrow: {
            display: "none",
          },
        },
        tooltipComponent: CustomTooltip,
      },
      {
        target: `[data-tour-step="create-repository-button"]`,
        content: "Click on “Create” to add a new Repository.",
        disableBeacon: true,
        placement: "right",
      },
      {
        target: `[data-tour-step="create-repository-name"]`,
        content:
          "Fill in the relevant “Name” and “Description” of the Repository.",
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repository-form-privacy"]`,
        content:
          "Fill in the relevant “Privacy” of the Repository – selecting “Business Unit” privacy will then show a dropdown to select the Business Unit, whilst selecting “Custom” will show a dropdown where you can “Select audience” for the new Repository.",
        disableBeacon: true,
        // spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repository-form-owners"]`,
        content:
          "Fill in the relevant “Owner(s)” of the Repository, which can be a maximum of 3 Users including yourself. These Repository Owners will be added to all Documents within the Repository automatically.",
        disableBeacon: true,
        // spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repository-form-review-interval"]`,
        content: "Select the “Review interval” for the Repository.",
        disableBeacon: true,
        // spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repository-form-button"]`,
        content:
          "Click on “Create repository” to add the Repository to the system.",
        disableBeacon: true,
        // spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repository-table"]`,
        content:
          "View the details of any Repository by clicking on the entry in the table, or on the “Actions” button and then on “Details”.",
        disableBeacon: true,
        // spotlightClicks: true,
      },
      {
        target: `[data-tour-step="main-container"]`,
        content:
          "To edit the Repository details from here, simply click on the 3 dots next to the ‘file total’ in the top right of the Repository. You must be a Repository Owner to amend the details of the Repository.",
        disableBeacon: true,
        // spotlightClicks: true,
      },
      {
        target: `[data-tour-step="repository-actions"]`,
        content:
          "To edit the Repository details from here, simply click on the 3 dots next to the ‘file total’ in the top right of the Repository. You must be a Repository Owner to amend the details of the Repository.",
        disableBeacon: true,
        // spotlightClicks: true,
      },
    ],
    callback: function (data) {
      let { type, status, index, setCurrentStep, action, lifecycle } = data;
      const tabElement = document.querySelector(
        `[data-tour-step="repository-table"]`,
      );

      const dataId = tabElement?.getAttribute("data-id");

      if (!localStorage.getItem("row-id") && dataId) {
        localStorage.setItem("row-id", dataId);
      }
      const rowId = localStorage.getItem("row-id");

      if (type === EVENTS.STEP_AFTER && action !== ACTIONS.PREV) {
        setCurrentStep((prev) => prev + 1);
      }
      if (type === EVENTS.STEP_AFTER && action === ACTIONS.PREV) {
        setCurrentStep((prev) => prev - 1);
      }
      if (index === 0) {
        history.push("/admin/document-repositories");
      }
      if (index === 1) {
        const tabElement = document.querySelector(
          `[data-tour-step="repositories-table-tab"]`,
        );
        if (tabElement) {
          const navItem =
            tabElement.querySelector(".nav-item") || tabElement.firstChild;
          navItem.click();
        }
      }
      if (
        index === 2 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        data.pauseTour();
        openDrawer("create-repository");
        setTimeout(() => {
          setCurrentStep(3);
          data.resumeTour();
        }, 500);
      }
      if (index === 8) {
        closeDrawer("create-repository");
      }
      if (
        index === 8 &&
        action !== ACTIONS.PREV &&
        type === EVENTS.STEP_AFTER
      ) {
        if (rowId) {
          history.push(`/admin/document-repositories/${rowId}`);
        } else {
          console.error("Missing row-id for navigation");
          return;
        }
      }

      if (action === ACTIONS.SKIP) {
        localStorage.removeItem("row-id");
        data.pauseTour();
        setCurrentStep(0);
      }
      if (status === STATUS.FINISHED) {
        localStorage.removeItem("row-id");
        data.pauseTour();
        history.push("/admin/guidelines");
        setCurrentStep(0);
      }
    },
  };

  return course;
}
