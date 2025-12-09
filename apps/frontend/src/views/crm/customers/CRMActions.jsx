import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAlerts from "@/hooks/useAlerts";
import { Card, DrawerOpener, DrawerRight } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import { useCRM } from "./store";

const CRMActions = () => {
  let { visitingCustomer } = useCRM();
  let { handleCreateTask } = useTask();
  let { alert } = useAlerts();
  return (
    <React.Fragment>
      {alert}
      <Card className="bg-light shadow-none">
        <div className="d-flex justify-content-center">
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
        <DrawerRight drawerId="add-task-form">
          {visitingCustomer && (
            <TaskForm
              drawerView={true}
              module={visitingCustomer._id}
              moduleType="customers"
              onSubmit={async (data) => {
                await handleCreateTask(data);
              }}
            />
          )}
        </DrawerRight>
      </Card>
    </React.Fragment>
  );
};

export default CRMActions;
