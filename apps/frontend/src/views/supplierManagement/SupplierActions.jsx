import React from "react";
import { useSupplier } from "./store";
import { useTask } from "@/views/taskManagement/store";
import {
  Card,
  DrawerOpener,
  DrawerRight,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import TaskForm from "@/views/taskManagement/TaskForm";

const SupplierActions = () => {
  let { reloadSupplier, visitingSupplier } = useSupplier();
  let { handleCreateTask } = useTask();
  let { closeDrawer } = useDrawer();
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
          {visitingSupplier && (
            <TaskForm
              drawerView={true}
              module={visitingSupplier._id}
              moduleType="suppliers"
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadSupplier();
              }}
            />
          )}
        </DrawerRight>
      </Card>
    </React.Fragment>
  );
};

export default SupplierActions;
