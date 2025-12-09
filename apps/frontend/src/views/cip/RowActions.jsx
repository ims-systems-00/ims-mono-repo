import defaultModalImage from "@/assets/img/modal-warning.svg";
import NotificationContext from "@/contexts/notificationContext";
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
import USER_ACTIONS from "./actions";
import { useCip } from "./store";

export const RowActions = ({ row }) => {
  const history = useHistory();
  const { nudgeCip, processing, deleteCip } = useCip();
  const { authUser, authAdminAccess, entityAccessControl } = useAccess();
  const notify = React.useContext(NotificationContext);

  const { isOpen: isNudgeModalOpen, toggle: toggleNudgeModal } =
    useDualStateController();
  const { isOpen: isDeleteModalOpen, toggle: toggleDeleteModal } =
    useDualStateController();

  const cip = row?.original;
  const isImplemented = cip?.implemented?.status === "Implemented";

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
                history.push(`/admin/cip/${cip?._id}`);
              }}
            >
              Details
            </DTRowAction>

            {!isImplemented && (
              <DTRowAction
                onClick={(e) => {
                  e.stopPropagation();
                  if (!cip?.owner) {
                    notify("OFI owner is not assigned", "danger");
                    return;
                  }
                  toggleNudgeModal();
                }}
              >
                Nudge
              </DTRowAction>
            )}

            {authUser({
              service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
              action: ACTIONS.DELETE,
              effect: EFFECTS.ALLOW,
            }) &&
              (authAdminAccess() ||
                entityAccessControl({
                  users: cip?.created?.by ? [cip?.created?.by?._id] : [],
                  effect: "Allow",
                })) &&
              !isImplemented && (
                <DTRowAction
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDeleteModal();
                  }}
                >
                  {processing[USER_ACTIONS.DELETE_CIP]?.status &&
                  processing[USER_ACTIONS.DELETE_CIP]?.id === cip?._id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Delete"
                  )}
                </DTRowAction>
              )}
          </DrawerOpener>
        </DTRowActionsMenu>
      </DTRowActionsDropdown>

      <Modal isOpen={isNudgeModalOpen} toggle={() => toggleNudgeModal()} centered>
        <ModalHeader toggle={() => toggleNudgeModal()}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column align-items-center">
            <img src={defaultModalImage} alt="" />
            <p className="mb-1 fw-bold">Are you sure?</p>
            <p>
              {cip?.owner?.name} will be nudged to look at {cip?.reference} {cip?.title}
            </p>
          </div>
          <div className="text-center mt-2">
            <Button onClick={() => toggleNudgeModal()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              onClick={() => {
                nudgeCip(cip);
                toggleNudgeModal();
              }}
              className="bg-primary text-white"
            >
              Confirm
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} toggle={() => toggleDeleteModal()} centered>
        <ModalHeader toggle={() => toggleDeleteModal()}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column align-items-center">
            <img src={defaultModalImage} alt="" />
            <p className="mb-1 fw-bold">Are you sure?</p>
            <p>This OFI will be deleted</p>
          </div>
          <div className="text-center mt-2">
            <Button onClick={() => toggleDeleteModal()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteCip(cip);
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

export default RowActions;


