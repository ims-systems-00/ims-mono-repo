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
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import defaultModalImage from "@/assets/img/modal-warning.svg";
import { useTagsAndCategories } from "./store";

export const RowActions = ({ row }) => {
  const { processing, deleteTagAndCategory } = useTagsAndCategories();

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
              toggleDeleteModal();
            }}
            name="delete"
            id="delete"
            tooltip="Delete"
          >
            {processing.action === "delete" &&
            processing.id === row?.origianl?._id ? (
              <Spinner size="sm" />
            ) : (
              "Delete"
            )}
          </DTRowAction>
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
            <p>This tag will be deleted</p>
          </div>
          <div className="text-center mt-2">
            <Button
              onClick={() => toggleDeleteModal()}
              className="bg-danger text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteTagAndCategory(row?.original)}
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
