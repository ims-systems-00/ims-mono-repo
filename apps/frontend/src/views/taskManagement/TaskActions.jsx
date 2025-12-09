import TooltipButton from "@/components/Tooltip/TooltipButton";
import { Card } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useTask } from "./store";

const TaskActions = ({ task }) => {
  const { handelNudgeOwner, alert, warningWithConfirmMessage } = useTask();

  return (
    <React.Fragment>
      {alert}
      {task.completed.status !== "Complete" && (
        <Card className="bg-light shadow-none">
          <div className="d-flex justify-content-center align-items-center p-3">
            {task.completed.status !== "Complete" && (
              <TooltipButton
                onClick={(e) => {
                  warningWithConfirmMessage(
                    `Assignee for the task will be nudged to look at ${task.reference} ${task.name}`,
                    () => {
                      handelNudgeOwner(task._id);
                    }
                  );
                }}
                name="nudge"
                id="nudge"
                tooltip={
                  new Date(task.nextNudgeAt) > new Date()
                    ? `Already nudged ${
                        task.assignedTo.length > 1
                          ? "assignee"
                          : task.assignedTo[0]?.user?.name
                      }`
                    : `Nudge ${
                        task.assignedTo.length > 1
                          ? "assignee"
                          : task.assignedTo[0]?.user?.name
                      }`
                }
                className="border border-0 btn-link-primary"
                size="lg"
                color="link"
              >
                <i className="ims-icons-20 icon-icon-nudge-24" />
              </TooltipButton>
            )}
          </div>
        </Card>
      )}
    </React.Fragment>
  );
};

export default TaskActions;
