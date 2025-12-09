import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useExpenseReport } from "./store";
import ExpenseDrawerActions from "./ExpenseDrawerActions";

const ExpenseReportToolbar = () => {
  let { visitingExpenseReport: expenseReport, getSubmissionStatus } =
    useExpenseReport();
  return (
    <React.Fragment>
      {getSubmissionStatus() !== "Approved" &&
        getSubmissionStatus() !== "Rejected" && (
          <React.Fragment>
            <div className="">
              <ExpenseDrawerActions />
            </div>
            <DrawerOpener drawerId="edit-expense-report-form">
              <Button outline size="sm" className="border-0 ">
                <i className="ims-icons-20 icon-icon-pencil-24" />
              </Button>
            </DrawerOpener>
          </React.Fragment>
        )}
    </React.Fragment>
  );
};

export default ExpenseReportToolbar;
