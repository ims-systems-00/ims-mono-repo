import Box from "@/components/Box/Index";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAlerts from "@/hooks/useAlerts";
import {
  DrawerOpener,
  DrawerRight,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import authCompliance from "@/utils/complianceAuthCheck";
import SearchableCompliance from "@/views/compliance/searchableList/components/Index";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import { useAudits } from "./store";

const AuditActions = () => {
  let {
    processing,
    visitingAudit,
    linkISOControl,
    removeISOControl,
    controlsOnVisitingAudit,
    isCompletedAudit,
    reloadAudit,
  } = useAudits();
  let { closeDrawer } = useDrawer();
  let { alert } = useAlerts();
  let { handleCreateTask } = useTask();

  return (
    <React.Fragment>
      {alert}
      {!isCompletedAudit() && (
        <Box>
          <div className="d-flex justify-content-center">
            {authCompliance() && (
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
              preSelectedControls={controlsOnVisitingAudit}
            />
          </DrawerRight>

          <DrawerRight drawerId="add-task-form">
            {visitingAudit && (
              <TaskForm
                drawerView={true}
                module={visitingAudit._id}
                moduleType="audits"
                onSubmit={async (data) => {
                  await handleCreateTask(data);
                  closeDrawer("add-task-form");
                  reloadAudit();
                }}
              />
            )}
          </DrawerRight>
        </Box>
      )}
    </React.Fragment>
  );
};

export default AuditActions;
