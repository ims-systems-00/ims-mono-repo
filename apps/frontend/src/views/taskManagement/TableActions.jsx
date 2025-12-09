import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAccess from "@/hooks/useAccess";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import { useHistory } from "react-router-dom";
import USER_ACTIONS from "./actions";
import { useTask } from "./store";
const AcceptTaskButton = ({ children, onClick }) => {
  return (
    <>
      <TooltipButton
        onClick={onClick}
        color="success"
        size="sm"
        id="accept"
        tooltip="Accept"
        className=""
      >
        {children}
      </TooltipButton>
    </>
  );
};
const DeclineTaskButton = ({ children, onClick }) => {
  return (
    <>
      <TooltipButton
        onClick={onClick}
        size="sm"
        id="decline"
        tooltip="Decline"
        color="danger"
        className=""
      >
        {children}
      </TooltipButton>
    </>
  );
};
export const MyTaskTableActions = ({ data }) => {
  let {
    setTask,
    processing,
    handleDeleteTask,
    handleCompleteTask,
    handelNudgeOwner,
    warningWithConfirmMessage,
  } = useTask();
  let { entityAccessControl } = useAccess();

  let history = useHistory();

  return (
    <>
      <UncontrolledDropdown size="sm" direction="right">
        <DropdownToggle
          data-display="static"
          onClick={(e) => {
            e.stopPropagation();
            setTask(data);
          }}
          outline
          className="border border rounded-circle"
        >
          <i className="fa-solid fa-ellipsis-h" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/admin/tasks/${data._id}`);
            }}
            id="detail"
            tooltip="View Details"
          >
            Details
          </DropdownItem>
          {data.completed.status !== "Complete" && (
            <>
              <DropdownItem
                onClick={(e) => {
                  e.stopPropagation();
                  warningWithConfirmMessage(
                    `Assignee for the task will be nudged to look at ${data.reference} ${data.name}`,
                    () => {
                      handelNudgeOwner(data._id);
                    }
                  );
                }}
                name="nudge"
                id="nudge"
              >
                Nudge
              </DropdownItem>

              {entityAccessControl({
                users: data.created.by ? [data.created.by._id] : [],
                effect: "Allow",
              }) && (
                <DropdownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    warningWithConfirmMessage(
                      "This task will be deleted",
                      () => {
                        handleDeleteTask(data._id);
                      }
                    );
                  }}
                >
                  {processing[USER_ACTIONS.DELETE_ATTACHMENT] &&
                  processing[USER_ACTIONS.DELETE_ATTACHMENT].id === data._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Delete"
                  )}
                </DropdownItem>
              )}

              {entityAccessControl({
                users: data.created.by
                  ? [
                      data.created.by._id,
                      ...data.assignedTo.map((assignee) => assignee?.user?._id),
                    ]
                  : [],
                effect: "Allow",
              }) ? (
                <DropdownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    warningWithConfirmMessage(
                      "This task will be completed. No one else will be able to amend it later",
                      () => {
                        handleCompleteTask(data._id);
                      }
                    );
                  }}
                >
                  {processing[USER_ACTIONS.COMPLETE_TASK] &&
                  processing[USER_ACTIONS.COMPLETE_TASK].id === data._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Mark as complete"
                  )}
                </DropdownItem>
              ) : null}
            </>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>{" "}
    </>
  );
};
export const RequestedTaskTableActions = ({ task }) => {
  let { processing, handleRequestedTask, warningWithConfirmMessage } =
    useTask();
  return (
    <div className="actions-right">
      <AcceptTaskButton
        onClick={(e) => {
          warningWithConfirmMessage("This task will be accepted", () => {
            handleRequestedTask("Accepted", task._id);
          });
        }}
      >
        {processing[USER_ACTIONS.REQUESTED_TASK] &&
        processing[USER_ACTIONS.REQUESTED_TASK].id === task._id ? (
          <Spinner size="sm" />
        ) : (
          "Yes"
        )}
      </AcceptTaskButton>
      <DeclineTaskButton
        onClick={(e) => {
          warningWithConfirmMessage("This task will be declined", () => {
            handleRequestedTask("Declined", task._id);
          });
        }}
      >
        {processing[USER_ACTIONS.REQUESTED_TASK] &&
        processing[USER_ACTIONS.REQUESTED_TASK].id === task._id ? (
          <Spinner size="sm" />
        ) : (
          "No"
        )}
      </DeclineTaskButton>
    </div>
  );
};
