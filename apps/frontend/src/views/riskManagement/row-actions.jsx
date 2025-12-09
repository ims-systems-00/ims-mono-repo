import React from "react";
import { useHistory } from "react-router-dom";
import {
  DTRowAction,
  DTRowActionsMenu,
  DTRowActionsToggle,
  DTRowActionsDropdown,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "@ims-systems-00/ims-ui-kit";
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";
import USER_ACTIONS from "./actions";
import { useRisk } from "./store";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import defaultModalImage from "@/assets/img/modal-warning.svg";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";

export const RowActions = ({ row }) => {
  const history = useHistory();
  const notify = React.useContext(NotificationContext);
  let { processing, isMitigatedRisk, nudgeRisk, escalateRisk, deleteRisk } =
    useRisk();
  const { isOpen: isNudgeModalOpen, toggle: toggleNudgeModal } =
    useDualStateController();
  const { authUser, authAdminAccess, entityAccessControl } = useAccess();
  const { isOpen: isEscapeModalOpen, toggle: toggleEscapeModal } =
    useDualStateController();

  const { isOpen: isDeleteModalOpen, toggle: toggleDeleteModal } =
    useDualStateController();
  return (
    <React.Fragment>
      <DTRowActionsDropdown>
        <DTRowActionsToggle size="sm">
          <ActionDotIcon color="black" size={20}></ActionDotIcon>
        </DTRowActionsToggle>
        <DTRowActionsMenu>
          <DTRowAction
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/admin/risks/${row?.original?._id}`);
            }}
          >
            Details
          </DTRowAction>

          {!isMitigatedRisk(row?.original) && (
            <DTRowAction
              onClick={(e) => {
                e.stopPropagation();
                if (!row?.original.owner) {
                  notify("Risk owner is not assigned", "danger");
                  return;
                }
                toggleNudgeModal();
              }}
            >
              {processing[USER_ACTIONS.NUDGE_OWNER].status &&
              processing[USER_ACTIONS.NUDGE_OWNER].id === row?.original._id ? (
                <Spinner size="sm" />
              ) : (
                "Nudge"
              )}
            </DTRowAction>
          )}

          {!isMitigatedRisk(row?.original) &&
            authUser({
              service: IMS_SERVICES.RISK_MANAGEMENT,
              action: ACTIONS.DELETE,
              effect: EFFECTS.ALLOW,
            }) && (
              <DTRowAction
                onClick={(e) => {
                  if (row.original.escalated.status) {
                    e.stopPropagation();
                    notify("Risk already escalated", "danger");
                    return;
                  }

                  toggleEscapeModal();
                }}
              >
                {processing[USER_ACTIONS.ESCALATE_RISK].status &&
                processing[USER_ACTIONS.ESCALATE_RISK].id ===
                  row?.original._id ? (
                  <Spinner size="sm" />
                ) : (
                  "Escalate"
                )}
              </DTRowAction>
            )}

          {!isMitigatedRisk(row?.original) &&
            authUser({
              service: IMS_SERVICES.RISK_MANAGEMENT,
              action: ACTIONS.DELETE,
              effect: EFFECTS.ALLOW,
            }) &&
            (authAdminAccess() ||
              entityAccessControl({
                users: row?.original?.created.by
                  ? [row?.original?.created.by._id]
                  : [],
                effect: "Allow",
              })) && (
              <DTRowAction
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDeleteModal();
                }}
              >
                {processing[USER_ACTIONS.DELETE_RISK].status &&
                processing[USER_ACTIONS.DELETE_RISK].id ===
                  row?.original._id ? (
                  <Spinner size="sm" />
                ) : (
                  "Delete"
                )}
              </DTRowAction>
            )}
        </DTRowActionsMenu>
      </DTRowActionsDropdown>

      {/* Modal for nudge */}

      <Modal
        isOpen={isNudgeModalOpen}
        toggle={() => toggleNudgeModal()}
        centered
      >
        <ModalHeader toggle={() => toggleNudgeModal()}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column align-items-center">
            <img src={defaultModalImage} alt="" />
            <p className="mb-1 fw-bold">Are you sure?</p>
            <p>
              {row?.original?.owner?.name} will be nudged to look at{" "}
              {row?.original?.reference} {row?.original?.title}
            </p>
          </div>
          <div className="text-center mt-2">
            <Button
              onClick={() => toggleNudgeModal()}
              className="bg-danger text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => nudgeRisk(row?.original)}
              className="bg-primary text-white"
            >
              Confirm
            </Button>
          </div>
        </ModalBody>
      </Modal>
      {/* Escape Modal */}
      <Modal
        isOpen={isEscapeModalOpen}
        toggle={() => toggleEscapeModal()}
        centered
      >
        <ModalHeader toggle={() => toggleEscapeModal()}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column align-items-center">
            <img src={defaultModalImage} alt="" />
            <p className="mb-1 fw-bold">Are you sure?</p>
            <p>This risk will be escalated</p>
          </div>
          <div className="text-center mt-2">
            <Button
              onClick={() => toggleEscapeModal()}
              className="bg-danger text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => escalateRisk(row?.original)}
              className="bg-primary text-white"
            >
              Confirm
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        toggle={() => toggleDeleteModal()}
        centered
      >
        <ModalHeader toggle={() => toggleDeleteModal()}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column align-items-center">
            <img src={defaultModalImage} alt="" />
            <p className="mb-1 fw-bold">Are you sure?</p>
            <p>This risk will be deleted</p>
          </div>
          <div className="text-center mt-2">
            <Button
              onClick={() => toggleDeleteModal()}
              className="bg-danger text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteRisk(row?.original)}
              className="bg-primary text-white"
            >
              Confirm
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
