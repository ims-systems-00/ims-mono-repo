import defaultModalImage from "@/assets/img/modal-warning.svg";
import useAccess from "@/hooks/useAccess";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import {
  Button,
  DTRowAction,
  DTRowActionsDropdown,
  DTRowActionsMenu,
  DTRowActionsToggle,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import USER_ACTIONS from "./actions";
import { useTask } from "./store";
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";
export const RowActions = ({ row }) => {
  let {
    setTask,
    processing,
    handleDeleteTask,
    handleCompleteTask,
    handelNudgeOwner,
  } = useTask();
  let { entityAccessControl } = useAccess();

  const history = useHistory();

  const { isOpen: isNudgeModalOpen, toggle: toggleNudgeModal } =
    useDualStateController();
  const { isOpen: isDeleteModalOpen, toggle: toggleDeleteModal } =
    useDualStateController();

  const {
    isOpen: isMarkAsCompleteModalOpen,
    toggle: toggleMarkAsCompleteModal,
  } = useDualStateController();

  const task = row?.original;
  const isCompleted = task?.completed?.status === "Complete";

  return (
    <React.Fragment>
      <DTRowActionsDropdown>
        <DTRowActionsToggle size="sm">
          <ActionDotIcon
            color="black"
            size={20}
            onClick={() => {
              setTask(task);
            }}
          ></ActionDotIcon>
        </DTRowActionsToggle>
        <DTRowActionsMenu>
          <DTRowAction
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/admin/tasks/${task?._id}`);
            }}
          >
            Details
          </DTRowAction>
          {!isCompleted && (
            <>
              <DTRowAction
                onClick={(e) => {
                  e.stopPropagation();

                  toggleNudgeModal();
                }}
              >
                Nudge
              </DTRowAction>
              {entityAccessControl({
                users: task.created.by ? [task.created.by._id] : [],
                effect: "Allow",
              }) && (
                <DTRowAction
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDeleteModal();
                  }}
                >
                  {processing[USER_ACTIONS.DELETE_ATTACHMENT] &&
                  processing[USER_ACTIONS.DELETE_ATTACHMENT].id === task._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Delete"
                  )}
                </DTRowAction>
              )}

              {entityAccessControl({
                users: task.created.by
                  ? [
                      task.created.by._id,
                      ...task.assignedTo.map((assignee) => assignee?.user?._id),
                    ]
                  : [],
                effect: "Allow",
              }) ? (
                <DTRowAction
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMarkAsCompleteModal();
                  }}
                >
                  {processing[USER_ACTIONS.COMPLETE_TASK] &&
                  processing[USER_ACTIONS.COMPLETE_TASK].id === task._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Mark as complete"
                  )}
                </DTRowAction>
              ) : null}
            </>
          )}
        </DTRowActionsMenu>
      </DTRowActionsDropdown>

      <Modal
        isOpen={isNudgeModalOpen}
        toggle={() => toggleNudgeModal()}
        centered
        style={{ maxWidth: "450px" }}
      >
        <ModalHeader toggle={() => toggleNudgeModal()}></ModalHeader>
        <ModalBody>
          <ModalItem
            title={"Are you sure?"}
            content={`Assignee for the task will be nudged to look at ${task.reference} ${task.name}`}
            close={toggleNudgeModal}
            confirm={() => {
              handelNudgeOwner(task._id);
              toggleNudgeModal();
            }}
          />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        toggle={() => toggleDeleteModal()}
        centered
        style={{ maxWidth: "450px" }}
      >
        <ModalHeader toggle={() => toggleDeleteModal()}></ModalHeader>
        <ModalBody>
          <ModalItem
            title={"Are you sure?"}
            content={`This task will be deleted`}
            close={toggleDeleteModal}
            confirm={() => {
              handleDeleteTask(task._id);
              toggleDeleteModal();
            }}
          />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={isMarkAsCompleteModalOpen}
        toggle={() => toggleMarkAsCompleteModal()}
        centered
        style={{ maxWidth: "450px" }}
      >
        <ModalHeader toggle={() => toggleMarkAsCompleteModal()}></ModalHeader>
        <ModalBody>
          <ModalItem
            title={"Are you sure?"}
            content={`This task will be completed. No one else will be able to amend it later`}
            close={toggleMarkAsCompleteModal}
            confirm={() => {
              handleCompleteTask(task._id);
              toggleMarkAsCompleteModal();
            }}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default RowActions;

const ModalItem = ({ title, content, close, confirm }) => {
  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <img src={defaultModalImage} alt="" />
        <p className="mb-1 fw-bold fs-4">{title}</p>
        <p className="text-center lh-base">{content}</p>
      </div>
      <div className="text-center mt-3 mb-2">
        <Button onClick={close} className="bg-danger text-white">
          Cancel
        </Button>
        <Button onClick={confirm} className="bg-primary text-white">
          Confirm
        </Button>
      </div>
    </>
  );
};
