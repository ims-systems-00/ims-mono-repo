import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import React, { useContext } from "react";
import ExpenseReportForm from "../ExpenseReportForm";
import { useExpenseReport } from "../store";

const ExpenseReportFormContainer = () => {
  const {
    visitingExpenseReport,
    updateExpenseReport,
    submitExpenseReport,
    approveExpenseReport,
    rejectExpenseReport,
  } = useExpenseReport();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <ExpenseReportForm
        expenseReport={visitingExpenseReport}
        onSubmit={async (data) => {
          await updateExpenseReport(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onSubmitReport={async () => {
          await submitExpenseReport();
          viewContextData.switchView && viewContextData.switchView();
        }}
        onApprove={async () => {
          await approveExpenseReport();
          viewContextData.switchView && viewContextData.switchView();
        }}
        onReject={async () => {
          await rejectExpenseReport();
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default ExpenseReportFormContainer;
