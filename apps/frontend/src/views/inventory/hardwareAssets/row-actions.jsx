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
import { useHardwareAssets } from "./store";
import useAccess from "@/hooks/useAccess";
import USER_ACTIONS from "./actions";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import defaultModalImage from "@/assets/img/modal-warning.svg";

export const RowActions = ({ row }) => {
  const history = useHistory();
  const { authUser, authAdminAccess, entityAccessControl } = useAccess();
  let { processing, handleDelete } = useHardwareAssets();

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
              history.push(`/admin/inventory/hardware/${row?.original?._id}`);
            }}
          >
            Details
          </DTRowAction>

          {authUser({
            service: IMS_SERVICES.INVENTORY,
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
                {processing[USER_ACTIONS.DELETE_HARDWARE] &&
                processing[USER_ACTIONS.DELETE_HARDWARE].id ===
                  row?.original?._id ? (
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
            <p>This asset will be deleted</p>
          </div>
          <div className="text-center mt-2">
            <Button
              onClick={() => toggleDeleteModal()}
              className="bg-danger text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(row?.original)}
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
