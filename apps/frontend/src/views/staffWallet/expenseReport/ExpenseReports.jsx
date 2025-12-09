import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import ExpenseReportTable from "./ExpenseReportTable";
import { ExpenseReportContextProvider } from "./store";
import { TaskContextProvider } from "@/views/taskManagement/store";

const ExpenseReports = (props) => {
  return (
    <>
      <DrawerContextProvider>
        <ExpenseReportContextProvider {...props}>
          <TaskContextProvider>
            <ExpenseReportTable {...props} />
          </TaskContextProvider>
        </ExpenseReportContextProvider>
      </DrawerContextProvider>
    </>
  );
};

export default ExpenseReports;
