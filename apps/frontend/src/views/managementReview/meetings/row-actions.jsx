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
import useAccess from "@/hooks/useAccess";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { useSchedule } from "./store";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import defaultModalImage from "@/assets/img/modal-warning.svg";

export const RowActions = ({ row }) => {
  const history = useHistory();
  const { processing, deleteReview } = useSchedule();
  const { authUser, entityAccessControl } = useAccess();
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
              history.push(`/admin/management-reviews/${row?.original?._id}`);
            }}
          >
            Details
          </DTRowAction>

          {!row?.original.completed.status &&
            authUser({
              service: IMS_SERVICES.MANAGEMENT_REVIEW,
              action: ACTIONS.DELETE,
              effect: EFFECTS.ALLOW,
            }) &&
            entityAccessControl({
              users: row?.original.created.by
                ? [row?.original.created.by._id]
                : [],
              effect: "Allow",
            }) && (
              <DTRowAction
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDeleteModal();
                }}
              >
                {processing.action === "delete" &&
                processing.id === row.original._id ? (
                  <Spinner size="sm" />
                ) : (
                  "Delete"
                )}
              </DTRowAction>
            )}
        </DTRowActionsMenu>
      </DTRowActionsDropdown>

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
            <p>This management review will be deleted</p>
          </div>
          <div className="text-center mt-2">
            <Button
              onClick={() => toggleDeleteModal()}
              className="bg-danger text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteReview(row?.original)}
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
