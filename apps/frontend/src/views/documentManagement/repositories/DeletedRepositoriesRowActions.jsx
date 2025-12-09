import defaultModalImage from "@/assets/img/modal-warning.svg";
import useAccess from "@/hooks/useAccess";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import {
    Button,
    DTRowAction,
    DTRowActionsDropdown,
    DTRowActionsMenu,
    DTRowActionsToggle,
    DrawerOpener,
    Modal,
    ModalBody,
    ModalHeader,
    Spinner,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";
import USER_ACTIONS from "./store/actions";

const DeletedRepositoriesRowActions = ({ row, onRestore, onHardDelete, processing }) => {
  const { authUser, authAdminAccess, entityAccessControl } = useAccess();

  const { isOpen: isRestoreModalOpen, toggle: toggleRestoreModal } =
    useDualStateController();
  const { isOpen: isHardDeleteModalOpen, toggle: toggleHardDeleteModal } =
    useDualStateController();

  const repository = row?.original;

  return (
    <React.Fragment>
      <DTRowActionsDropdown>
        <DTRowActionsToggle size="sm">
        <ActionDotIcon color="black" size={20}></ActionDotIcon>
        </DTRowActionsToggle>
        <DTRowActionsMenu>
          <DrawerOpener>
            <DTRowAction
              onClick={(e) => {
                e.stopPropagation();
                toggleRestoreModal();
              }}
            >
              {processing?.[USER_ACTIONS.RESTORE_REPOSITORY]?.status &&
              processing?.[USER_ACTIONS.RESTORE_REPOSITORY]?.id === repository?._id ? (
                <Spinner size="sm" />
              ) : (
                "Restore"
              )}
            </DTRowAction>
            {authUser({
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              action: ACTIONS.DELETE,
              effect: EFFECTS.ALLOW,
            }) &&
              (authAdminAccess() ||
                entityAccessControl({
                  users: [repository?.created?.by?._id, repository?.owner?._id],
                  effect: "Allow",
                })) && (
                <DTRowAction
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHardDeleteModal();
                  }}
                >
                  {processing?.[USER_ACTIONS.HARD_DELETE_REPOSITORY]?.status &&
                  processing?.[USER_ACTIONS.HARD_DELETE_REPOSITORY]?.id === repository?._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Delete permanently"
                  )}
                </DTRowAction>
              )}
          </DrawerOpener>
        </DTRowActionsMenu>
      </DTRowActionsDropdown>

      <Modal isOpen={isRestoreModalOpen} toggle={() => toggleRestoreModal()} centered>
        <ModalHeader toggle={() => toggleRestoreModal()}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column align-items-center">
            <img src={defaultModalImage} alt="" />
            <p className="mb-1 fw-bold">Are you sure?</p>
            <p>Repository {repository?.reference} will be restored</p>
          </div>
          <div className="text-center mt-2">
            <Button onClick={() => toggleRestoreModal()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onRestore && onRestore(repository);
                toggleRestoreModal();
              }}
              className="bg-primary text-white"
            >
              Confirm
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={isHardDeleteModalOpen} toggle={() => toggleHardDeleteModal()} centered>
        <ModalHeader toggle={() => toggleHardDeleteModal()}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column align-items-center">
            <img src={defaultModalImage} alt="" />
            <p className="mb-1 fw-bold">Are you sure?</p>
            <p>Repository {repository?.reference} will be deleted permanently</p>
          </div>
          <div className="text-center mt-2">
            <Button onClick={() => toggleHardDeleteModal()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onHardDelete && onHardDelete(repository);
                toggleHardDeleteModal();
              }}
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

export default DeletedRepositoriesRowActions;


