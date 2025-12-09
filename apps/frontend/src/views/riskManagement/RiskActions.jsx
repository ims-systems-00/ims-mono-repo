import TooltipButton from "@/components/Tooltip/TooltipButton";
import {
  Card,
  DrawerOpener,
  DrawerRight,
  Spinner,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import USER_ACTIONS from "./actions";
import { useRisk } from "./store";
import useAccess from "@/hooks/useAccess";
import NotificationContext from "@/contexts/notificationContext";

import SearchableCompliance from "@/views/compliance/searchableList/components/Index";
import { useTask } from "@/views/taskManagement/store";
import TaskForm from "@/views/taskManagement/TaskForm";
import useAlerts from "@/hooks/useAlerts";
import authCompliance from "@/utils/complianceAuthCheck";
import Box from "@/components/Box/Index";

const RiskActions = () => {
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
  let { closeDrawer } = useDrawer();
  let { alert, successAlert, warningWithConfirmMessage } = useAlerts();
  let { handleCreateTask } = useTask();
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);

  return (
    <React.Fragment>
      {alert}
      {!isMitigatedRisk(risk) && (
        <Box>
          <div className="d-flex justify-content-center">
            <TooltipButton
              size="lg"
              name="nudge"
              id="nudge"
              color="link"
              className="btn-link-primary"
              tooltip={
                new Date(risk.nextNudgeAt) > new Date()
                  ? `Already nudged ${risk.owner?.name}`
                  : `Nudge ${risk.owner?.name}`
              }
              onClick={(e) => {
                warningWithConfirmMessage(
                  `${risk.owner.name} will be nudged to look at ${risk.reference} ${risk.title}`,
                  () => {
                    nudgeRisk(risk);
                  }
                );
              }}
              disabled={new Date(risk.nextNudgeAt) > new Date()}
            >
              {processing[USER_ACTIONS.NUDGE_OWNER].status &&
              processing[USER_ACTIONS.NUDGE_OWNER].id === risk._id ? (
                <Spinner size="sm" />
              ) : (
                <i className="ims-icons-20 icon-icon-nudge-24" />
              )}
            </TooltipButton>
            {authUser({
              service: IMS_SERVICES.RISK_MANAGEMENT,
              action: ACTIONS.DELETE,
              effect: EFFECTS.ALLOW,
            }) && (
              <TooltipButton
                size="lg"
                color="link"
                name="escalate"
                id="escalate"
                tooltip={
                  risk?.escalated?.status ? "Already escalated" : "Escalate"
                }
                className="btn-link-danger"
                // disabled={risk?.escalated?.status}
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
                {processing[USER_ACTIONS.ESCALATE_RISK].status &&
                processing[USER_ACTIONS.ESCALATE_RISK].id === risk._id ? (
                  <Spinner size="sm" />
                ) : (
                  <i className="ims-icons-20 icon-icon-warning-24" />
                )}
              </TooltipButton>
            )}
            {authUser(authCompliance()) && (
              <DrawerOpener drawerId="compliance-control-picker">
                <TooltipButton
                  size="lg"
                  name="nudge"
                  id="nudge"
                  color="link"
                  tooltip="Select Compliance Control(s)"
                  className="btn-link-primary"
                >
                  <i className="ims-icons-20 icon-icon-shieldcheck-24" />
                </TooltipButton>
              </DrawerOpener>
            )}
            <DrawerOpener drawerId="add-task-form">
              <TooltipButton
                size="lg"
                name="nudge"
                id="nudge"
                color="link"
                tooltip="Link task"
                className="btn-link-primary"
              >
                <i className="ims-icons-20 icon-icon-notepad-24" />
              </TooltipButton>
            </DrawerOpener>
          </div>
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
        </Box>
      )}
    </React.Fragment>
  );
};

export default RiskActions;
