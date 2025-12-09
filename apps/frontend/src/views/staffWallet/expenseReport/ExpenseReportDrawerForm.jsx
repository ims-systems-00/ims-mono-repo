import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import ExpenseReportForm from "./ExpenseReportForm";
import { useExpenseReport } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const ExpenseReportDrawerForm = () => {
  const {
    visitingExpenseReport,
    updateExpenseReport,
    submitExpenseReport,
    approveExpenseReport,
    rejectExpenseReport,
  } = useExpenseReport();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingExpenseReport} />
      <ExpenseReportForm
        drawerView
        expenseReport={visitingExpenseReport}
        onSubmit={async (data) => {
          await updateExpenseReport(data);
          closeDrawer("edit-expense-report-form");
        }}
        onSubmitReport={async () => {
          await submitExpenseReport();
          closeDrawer("edit-expense-report-form");
        }}
        onApprove={async () => {
          await approveExpenseReport();
          closeDrawer("edit-expense-report-form");
        }}
        onReject={async () => {
          await rejectExpenseReport();
          closeDrawer("edit-expense-report-form");
        }}
      />
    </React.Fragment>
  );
};

export default ExpenseReportDrawerForm;
