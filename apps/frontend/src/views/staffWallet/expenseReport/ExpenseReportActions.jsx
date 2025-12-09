import React from "react";

import { useTask } from "@/views/taskManagement/store";

import TooltipButton from "@/components/Tooltip/TooltipButton";
import {
  Card,
  DrawerOpener,
  DrawerRight,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import useAlerts from "@/hooks/useAlerts";

import TaskForm from "@/views/taskManagement/TaskForm";
import { useExpenseReport } from "./store";

const ExpenseReportActions = () => {
  let { visitingExpenseReport: expenseReport, reloadExpenseReport } =
    useExpenseReport();
  let { closeDrawer } = useDrawer();
  let { handleCreateTask } = useTask();
  let { alert } = useAlerts();
  return (
    <>
      {alert}
      <Card className="bg-light shadow-none">
        <div className="d-flex justify-content-center align-items-center mb-3">
          <DrawerOpener drawerId="add-task-form">
            <TooltipButton
              size="lg"
              name="nudge"
              id="nudge"
              color="link"
              tooltip="Link task"
              className="btn-link-primary"
            >
              <i className="ims-icons-20 icon-icon-notepad-24" />
            </TooltipButton>
          </DrawerOpener>
        </div>
        <DrawerRight drawerId="add-task-form">
          {expenseReport && (
            <TaskForm
              drawerView={true}
              module={expenseReport._id}
              moduleType="expensereports"
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadExpenseReport();
              }}
            />
          )}
        </DrawerRight>
      </Card>
    </>
  );
};

export default ExpenseReportActions;
