import { TaskContextProvider } from "@/views/taskManagement/store";
import { ExpenseReportContextProvider } from "../store";
import ExpenseReportDetail from "./ExpenseReportDetail";

const Index = (props) => {
  return (
    <ExpenseReportContextProvider {...props}>
      <TaskContextProvider>
        <ExpenseReportDetail />
      </TaskContextProvider>
    </ExpenseReportContextProvider>
  );
};

export default Index;
