import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { ScheduleContextProvider } from "../store";
import ReviewDetails from "./ReviewDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";

const Index = (props) => {
  return (
    <ScheduleContextProvider {...props}>
      <DrawerContextProvider>
        <TaskContextProvider>
          <ReviewDetails />
        </TaskContextProvider>
      </DrawerContextProvider>
    </ScheduleContextProvider>
  );
};

export default Index;
