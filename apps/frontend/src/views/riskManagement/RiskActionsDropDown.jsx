import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import {
  DrawerRight,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { useRisk } from "./store";

import useAlerts from "@/hooks/useAlerts";
import authCompliance from "@/utils/complianceAuthCheck";
import SearchableCompliance from "@/views/compliance/searchableList/components/Index";
import { useTask } from "@/views/taskManagement/store";
import TaskForm from "@/views/taskManagement/TaskForm";

const RiskActionsDropDown = () => {
  let {
    processing,
    nudgeRisk,
    escalateRisk,
    visitingRisk: risk,
    isMitigatedRisk,
    linkISOControl,
    removeISOControl,
    controlsOnVisitingRisk,
    reloadRisk,
  } = useRisk();
  let { closeDrawer, openDrawer } = useDrawer();
  let { alert, successAlert, warningWithConfirmMessage } = useAlerts();
  let { handleCreateTask } = useTask();
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);

  return (
    <React.Fragment>
      {alert}
      {!isMitigatedRisk(risk) && (
        <>
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
                    `${risk.owner.name} will be nudged to look at ${risk.reference} ${risk.title}`,
                    () => {
                      nudgeRisk(risk);
                    }
                  );
                }}
              >
                <i className="ims-icons-20 icon-icon-nudge-24" />
                Nudge
              </DropdownItem>
              {authUser({
                service: IMS_SERVICES.RISK_MANAGEMENT,
                action: ACTIONS.DELETE,
                effect: EFFECTS.ALLOW,
              }) && (
                <DropdownItem
                  id="escalate"
                  onClick={(e) => {
                    if (risk.escalated.status === true) {
                      notify("Risk already escalated", "danger");
                      return;
                    }
                    warningWithConfirmMessage(
                      "This risk will be escalated",
                      () => {
                        escalateRisk(risk);
                        successAlert("Escalated successfully");
                      }
                    );
                  }}
                >
                  <i className="ims-icons-20 icon-icon-warning-24" />
                  Escalate
                </DropdownItem>
              )}

              {authUser(authCompliance()) && (
                <DropdownItem
                  id="compliance"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDrawer("compliance-control-picker");
                  }}
                >
                  <i className="ims-icons-20 icon-icon-shieldcheck-24" />
                  Select Compliance Control(s)
                </DropdownItem>
              )}

              <DropdownItem
                id="task"
                onClick={(e) => {
                  e.stopPropagation();
                  openDrawer("add-task-form");
                }}
              >
                <i className="ims-icons-20 icon-icon-notepad-24" />
                Link task
              </DropdownItem>
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
              preSelectedControls={controlsOnVisitingRisk}
            />
          </DrawerRight>

          <DrawerRight drawerId="add-task-form">
            {risk && (
              <TaskForm
                drawerView={true}
                module={risk._id}
                moduleType="risks"
                onSubmit={async (data) => {
                  await handleCreateTask(data);
                  closeDrawer("add-task-form");
                  reloadRisk();
                }}
              />
            )}
          </DrawerRight>
        </>
      )}
    </React.Fragment>
  );
};

export default RiskActionsDropDown;
