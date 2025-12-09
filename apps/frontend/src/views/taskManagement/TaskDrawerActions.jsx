import PopAlert from "@/components/PopAlert/PopAlert";
import useAccess from "@/hooks/useAccess";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Spinner } from "reactstrap";
import USER_ACTIONS from "./actions";
import { useTask } from "./store";

const TaskDrawerActions = ({ ...props }) => {
  let {
    task,
    processing,
    handelNudgeOwner,
    handleCompleteTask,
    popAction,
    handlePopAction,
  } = useTask();
  let { entityAccessControl } = useAccess();

  return (
    <React.Fragment>
      <UncontrolledDropdown size="sm" direction="right">
        <DropdownToggle
          data-display="static"
          id="task-actions"
          onClick={(e) => e.stopPropagation()}
          size="sm"
          outline
          className="border border-0"
        >
          <i className="fa-solid fa-ellipsis-h" />
        </DropdownToggle>
        <DropdownMenu>
          {task?.completed.status !== "Complete" && (
            <>
              <DropdownItem
                onClick={(e) => {
                  e.stopPropagation();
                  handlePopAction("nudge");
                }}
                name="nudge"
                id="nudge"
              >
                Nudge
              </DropdownItem>

              {entityAccessControl({
                users: task?.created.by
                  ? [
                      task.created.by?._id,
                      ...task.assignedTo.map((assignee) => assignee?.user?._id),
                    ]
                  : [],
                effect: "Allow",
              }) ? (
                <DropdownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePopAction("complete");
                  }}
                >
                  {processing[USER_ACTIONS.COMPLETE_TASK] &&
                  processing[USER_ACTIONS.COMPLETE_TASK].id === task?._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Mark as complete"
                  )}
                </DropdownItem>
              ) : null}
            </>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>
      {task && (
        <React.Fragment>
          <PopAlert
            target="task-actions"
            openState={popAction === "nudge" ? "nudge" : ""}
            handleOpenState={handlePopAction}
            onCancel={() => handlePopAction("")}
            onConfirm={() => {
              handelNudgeOwner(task?._id);
              handlePopAction("");
            }}
            confirmText="Are you sure?"
            message={`Assignee for the task will be nudged to look at ${task.reference} ${task.name}`}
          />
          <PopAlert
            target="task-actions"
            openState={popAction === "complete" ? "complete" : ""}
            handleOpenState={handlePopAction}
            onCancel={() => handlePopAction("")}
            onConfirm={() => {
              handleCompleteTask(task?._id);
              handlePopAction("");
            }}
            confirmText="Are you sure?"
            message={`This task will be completed. No one else will be able to amend it later`}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default TaskDrawerActions;
