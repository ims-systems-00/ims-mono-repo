import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import TaskForm from "./TaskForm";
import { useTask } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const TaskDrawerForm = () => {
  const { task, processing, handleUpdateTask, handleCompleteTask } = useTask();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={task} />
      {task && (
        <TaskForm
          drawerView
          task={task}
          processing={processing}
          onCompleteTask={async () => {
            await handleCompleteTask(task._id);
            closeDrawer("edit-task-form");
          }}
          onSubmit={async (data) => {
            await handleUpdateTask(data, task._id);
            closeDrawer("edit-task-form");
          }}
        />
      )}
    </React.Fragment>
  );
};

export default TaskDrawerForm;
