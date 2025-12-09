import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import TaskDrawerActions from "./TaskDrawerActions";
import { useTask } from "./store";

const TaskToolBar = (props) => {
  const { task } = useTask();
  return (
    <React.Fragment>
      {task?.completed.status !== "Complete" && (
        <React.Fragment>
          <div className="">
            <TaskDrawerActions />
          </div>
          <DrawerOpener drawerId="edit-task-form">
            <Button outline size="sm" className="border-0 ">
              <i className="ims-icons-20 icon-icon-pencil-24" />
            </Button>
          </DrawerOpener>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default TaskToolBar;
