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
import USER_ACTIONS from "./actions";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import defaultModalImage from "@/assets/img/modal-warning.svg";
import useAccess from "@/hooks/useAccess";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { useCRM } from "./store";

export const RowActions = ({ row }) => {
  const { isOpen: isDeleteModalOpen, toggle: toggleDeleteModal } =
    useDualStateController();
  let { authUser, entityAccessControl, authGlobalAccess } = useAccess();
  const history = useHistory();
  let { processing, deleteCustomer } = useCRM();
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
              history.push(`/admin/customers/${row?.original._id}`);
            }}
          >
            Details
          </DTRowAction>

          {authUser({
            service: IMS_SERVICES.CRM,
            action: ACTIONS.DELETE,
            effect: EFFECTS.ALLOW,
          }) &&
            row?.original.stage !== "Live" &&
            (authGlobalAccess() ||
              entityAccessControl({
                users: row?.original.created.by
                  ? [row?.original.created.by._id]
                  : [],
                effect: "Allow",
              })) && (
              <DTRowAction
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDeleteModal();
                }}
              >
                {processing[USER_ACTIONS.REMOVE_CUSTOMER].status &&
                processing[USER_ACTIONS.REMOVE_CUSTOMER].id ===
                  row?.original._id ? (
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
            <p>This customer will be deleted</p>
          </div>
          <div className="text-center mt-2">
            <Button
              onClick={() => toggleDeleteModal()}
              className="bg-danger text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteCustomer(row?.original)}
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
