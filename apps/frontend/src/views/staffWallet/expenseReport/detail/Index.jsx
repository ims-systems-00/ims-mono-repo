import { TaskContextProvider } from "@/views/taskManagement/store";
import { ExpenseReportContextProvider } from "../store";
import ExpenseReportDetail from "./ExpenseReportDetail";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Index = (props) => {
  return (
    <ExpenseReportContextProvider {...props}>
      <DrawerContextProvider>
        <TaskContextProvider>
          <ExpenseReportDetail />
        </TaskContextProvider>
      </DrawerContextProvider>
    </ExpenseReportContextProvider>
  );
};

export default Index;
