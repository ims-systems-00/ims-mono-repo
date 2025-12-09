import TooltipButton from "@/components/Tooltip/TooltipButton";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import {
  DrawerOpener,
  DrawerRight,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import USER_ACTIONS from "./actions";
import { useIncident } from "./store";

import Box from "@/components/Box/Index";
import authCompliance from "@/utils/complianceAuthCheck";
import SearchableCompliance from "@/views/compliance/searchableList/components/Index";

const IncidentActions = () => {
  let {
    visitingIncident: incident,
    processing,
    escalateIncident,
    nudgeIncident,
    linkISOControl,
    removeISOControl,
    controlsOnVisitingIncident,
    reloadIncident,
  } = useIncident();
  let { handleCreateTask } = useTask();
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  let { closeDrawer } = useDrawer();
  return (
    <Box>
      {alert}
      <UncontrolledDropdown size="sm" direction="right">
        <DropdownToggle
          outline
          onClick={(e) => {
            e.stopPropagation();
          }}
          data-display="static"
          className="border-0"
        >
          <i className="fa-solid fa-ellipsis-h" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            id="nudge"
            onClick={(e) => {
              e.stopPropagation();
              warningWithConfirmMessage(
                `${incident.owner.name} will be nudged to look at ${incident?.reference} ${incident?.title}`,
                () => {
                  nudgeIncident(incident);
                }
              );
            }}
          >
            <i className="ims-icons-20 icon-icon-nudge-24" />
            Nudge
          </DropdownItem>
          {!incident?.resolved?.status && (
            <DropdownItem
              id="escalate"
              onClick={(e) => {
                e.stopPropagation();
                if (incident?.escalated?.status) {
                  notify("Incident already escalated", "danger");
                  return;
                }
                warningWithConfirmMessage(
                  "This incident will be escalated",
                  () => {
                    escalateIncident(incident);
                    successAlert("Escalated successfully");
                  }
                );
              }}
            >
              {processing[USER_ACTIONS.ESCALATE_INCIDENT].status &&
              processing[USER_ACTIONS.ESCALATE_INCIDENT].id == incident._id ? (
                <Spinner size="sm" />
              ) : (
                <i className="ims-icons-20 icon-icon-warning-24" />
              )}
              Escalate
            </DropdownItem>
          )}

          {authUser(authCompliance()) && (
            <DrawerOpener drawerId="compliance-control-picker">
              <DropdownItem
                id="compliance"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <i className="ims-icons-20 icon-icon-shieldcheck-24" />
                Select Compliance Control(s)
              </DropdownItem>
            </DrawerOpener>
          )}

          <DrawerOpener drawerId="add-task-form">
            <DropdownItem
              id="task"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <i className="ims-icons-20 icon-icon-notepad-24" />
              Link task
            </DropdownItem>
          </DrawerOpener>
        </DropdownMenu>
      </UncontrolledDropdown>
      <DrawerRight drawerId="compliance-control-picker">
        <SearchableCompliance
          onNewSelection={(data) =>
            linkISOControl({
              controls: [data?.control?._id],
              toolkits: [],
            })
          }
          onDeselection={(data) => {
            removeISOControl({
              controls: [data?.control?._id],
              toolkits: [],
            });
          }}
          preSelectedControls={controlsOnVisitingIncident}
        />
      </DrawerRight>

      <DrawerRight drawerId="add-task-form">
        {incident && (
          <TaskForm
            drawerView={true}
            module={incident._id}
            moduleType="incidents"
            onSubmit={async (data) => {
              await handleCreateTask(data);
              closeDrawer("add-task-form");
              reloadIncident();
            }}
          />
        )}
      </DrawerRight>
    </Box>
  );
};

export default IncidentActions;
