import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import TaskTable from "./TasksTable";
import { TaskContextProvider } from "./store";

const Tasks = ({ moduleType = "tasks", module = null, ...props }) => {
  return (
    <DrawerContextProvider>
      <TaskContextProvider moduleType={moduleType} module={module} {...props}>
        <TaskTable {...props} />
      </TaskContextProvider>
    </DrawerContextProvider>
  );
};

export default Tasks;
