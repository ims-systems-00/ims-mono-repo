import { ScheduleContextProvider } from "../store";
import ReviewDetails from "./ReviewDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";

const Index = (props) => {
  return (
    <ScheduleContextProvider {...props}>
      <TaskContextProvider>
        <ReviewDetails />
      </TaskContextProvider>
    </ScheduleContextProvider>
  );
};

export default Index;
