import ExpenseReportTable from "./ExpenseReportTable";
import { ExpenseReportContextProvider } from "./store";
import { TaskContextProvider } from "@/views/taskManagement/store";

const ExpenseReports = (props) => {
  return (
    <>
      <ExpenseReportContextProvider {...props}>
        <TaskContextProvider>
          <ExpenseReportTable {...props} />
        </TaskContextProvider>
      </ExpenseReportContextProvider>
    </>
  );
};

export default ExpenseReports;
