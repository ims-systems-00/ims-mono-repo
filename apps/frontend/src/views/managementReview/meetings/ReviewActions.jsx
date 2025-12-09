import React from "react";
import { useSchedule } from "./store";
import useAlerts from "@/hooks/useAlerts";
import { useTask } from "@/views/taskManagement/store";
import TaskForm from "@/views/taskManagement/TaskForm";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import {
  Card,
  DrawerOpener,
  DrawerRight,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";

const ReviewActions = () => {
  let { visitingReview, reloadReview } = useSchedule();
  let { handleCreateTask } = useTask();
  let { alert } = useAlerts();
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
          {visitingReview && (
            <TaskForm
              drawerView={true}
              moduleType="managementreviews"
              module={visitingReview._id}
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadReview();
              }}
            />
          )}
        </DrawerRight>
      </Card>
    </React.Fragment>
  );
};

export default ReviewActions;
