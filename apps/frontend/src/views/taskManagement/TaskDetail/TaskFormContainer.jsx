import React, { useContext } from "react";
import TaskForm from "../TaskForm";
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { useTask } from "../store";

const TaskFormContainer = () => {
  const { handleUpdateTask, handleCompleteTask, task } = useTask();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <TaskForm
        task={task}
        onCompleteTask={async () => {
          await handleCompleteTask(task._id);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onSubmit={async (data) => {
          await handleUpdateTask(data, task._id);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default TaskFormContainer;
