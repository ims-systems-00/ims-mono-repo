import TaskTable from "./TasksTable";
import { TaskContextProvider } from "./store";

const Tasks = ({ moduleType = "tasks", module = null, ...props }) => {
  return (
    <TaskContextProvider moduleType={moduleType} module={module} {...props}>
      <TaskTable {...props} />
    </TaskContextProvider>
  );
};

export default Tasks;
