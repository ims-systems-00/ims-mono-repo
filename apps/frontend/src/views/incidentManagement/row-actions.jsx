import React from "react";
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
import { useHistory } from "react-router-dom";
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { useIncident } from "./store";
import useAccess from "@/hooks/useAccess";
import NotificationContext from "@/contexts/notificationContext";
import USER_ACTIONS from "./actions";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import defaultModalImage from "@/assets/img/modal-warning.svg";
import { TourStep } from "../../components/Tour";

export const RowActions = ({ row }) => {
  const history = useHistory();
  const { nudgeIncident, processing, escalateIncident, deleteIncident } =
    useIncident();
  const { authUser, authAdminAccess, entityAccessControl } = useAccess();
  const notify = React.useContext(NotificationContext);
  const { isOpen: isNudgeModalOpen, toggle: toggleNudgeModal } =
    useDualStateController();
  const { isOpen: isEscapeModalOpen, toggle: toggleEscapeModal } =
    useDualStateController();
  const { isOpen: isDeleteModalOpen, toggle: toggleDeleteModal } =
    useDualStateController();
  return (
    <React.Fragment>
      <TourStep data-tour-step="create-incident-action">
        <DTRowActionsDropdown>
          <DTRowActionsToggle size="sm">
            <ActionDotIcon color="black" size={20}></ActionDotIcon>
          </DTRowActionsToggle>
          <DTRowActionsMenu>
            <DTRowAction
              onClick={(e) => {
                e.stopPropagation();
                history.push(`/admin/incidentmanagement/${row?.original?._id}`);
              }}
            >
              Details
            </DTRowAction>

            {!row?.original?.resolved.status && (
              <DTRowAction
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNudgeModal();
                }}
              >
                Nudge
              </DTRowAction>
            )}

            {authUser({
              service: IMS_SERVICES.INCIDENT_MANAGEMENT,
              action: ACTIONS.DELETE,
              effect: EFFECTS.ALLOW,
            }) &&
              !row?.original?.resolved.status && (
                <DTRowAction
                  // disabled={data.escalated.status}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (row?.original?.escalated.status) {
                      notify("Incident already escalated", "danger");
                      e.stopPropagation();
                      return;
                    }
                    toggleEscapeModal();
                  }}
                >
                  {processing[USER_ACTIONS.ESCALATE_INCIDENT].status &&
                  processing[USER_ACTIONS.ESCALATE_INCIDENT].id ==
                    row?.original?._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Escalate"
                  )}
                </DTRowAction>
              )}
            {authUser({
              service: IMS_SERVICES.INCIDENT_MANAGEMENT,
              action: ACTIONS.DELETE,
              effect: EFFECTS.ALLOW,
            }) &&
              (authAdminAccess() ||
                entityAccessControl({
                  users: row?.original?.created.by
                    ? [row?.original?.created.by._id]
                    : [],
                  effect: "Allow",
                })) &&
              !row?.original?.resolved.status && (
                <DTRowAction
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDeleteModal();
                  }}
                >
                  {processing[USER_ACTIONS.DELETE_INCIDENT].status &&
                  processing[USER_ACTIONS.DELETE_INCIDENT].id ===
                    row?.original?._id ? (
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
                onClick={() => nudgeIncident(row?.original)}
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
              <p>This incident will be escalated</p>
            </div>
            <div className="text-center mt-2">
              <Button
                onClick={() => toggleEscapeModal()}
                className="bg-danger text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => escalateIncident(row?.original)}
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
              <p>This incident will be deleted</p>
            </div>
            <div className="text-center mt-2">
              <Button
                onClick={() => toggleDeleteModal()}
                className="bg-danger text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteIncident(row?.original)}
                className="bg-primary text-white"
              >
                Confirm
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </TourStep>
    </React.Fragment>
  );
};
