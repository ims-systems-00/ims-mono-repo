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
import { useHistory } from "react-router-dom";
import USER_ACTIONS from "./store/actions";

export const RepositoriesRowActions = ({ row, onDelete }) => {
  const history = useHistory();
  const { authUser, authAdminAccess, entityAccessControl } = useAccess();
  const { processing } = row?.processing || {};

  const { isOpen: isDeleteModalOpen, toggle: toggleDeleteModal } =
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
                history.push(`/admin/document-repositories/${repository?._id}`);
              }}
            >
              Details
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
                    toggleDeleteModal();
                  }}
                >
                  {processing?.[USER_ACTIONS.SOFT_DELETE_REPOSITORY]?.status &&
                  processing?.[USER_ACTIONS.SOFT_DELETE_REPOSITORY]?.id ===
                    repository?._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Move to recycle bin"
                  )}
                </DTRowAction>
              )}
          </DrawerOpener>
        </DTRowActionsMenu>
      </DTRowActionsDropdown>

      <Modal isOpen={isDeleteModalOpen} toggle={() => toggleDeleteModal()} centered>
        <ModalHeader toggle={() => toggleDeleteModal()}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column align-items-center">
            <img src={defaultModalImage} alt="" />
            <p className="mb-1 fw-bold">Are you sure?</p>
            <p>Repository {repository?.reference} will be moved to recycle bin</p>
          </div>
          <div className="text-center mt-2">
            <Button onClick={() => toggleDeleteModal()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onDelete && onDelete(repository);
                toggleDeleteModal();
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

export default RepositoriesRowActions;
