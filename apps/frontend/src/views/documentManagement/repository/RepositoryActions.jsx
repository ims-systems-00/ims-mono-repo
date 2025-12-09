import useDualStateController from "@/hooks/useDualStateController";
import {
  Button,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import RepositoryForm from "./RepositoryForm";
import useRepository from "./store/useRepository";
import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";
import { useApplication } from "@/stores/applicationStore";
const RepositoryActions = ({}) => {
  const { repository, amendRepository, hasRepositoryOwnership } =
    useRepository();
  const { isOpen: isRepositoryFormOpen, toggle: toggleRepositoryForm } =
    useDualStateController();
  const { currentUserData } = useApplication();
  return (
    <Can
      policy={{
        service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
        action: ACTIONS.UPDATE,
      }}
    >
      {hasRepositoryOwnership(currentUserData?._id) && (
        <UncontrolledDropdown className="ms-2">
          <DropdownToggle className="border-0">
            <i className="fa-solid fa-ellipsis-vertical three-dots"></i>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={toggleRepositoryForm}>
              Edit Repository
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
      <Modal isOpen={isRepositoryFormOpen} toggle={toggleRepositoryForm}>
        <ModalBody>
          <RepositoryForm
            repository={repository}
            onSubmit={(data) => {
              amendRepository(data);
              toggleRepositoryForm();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            className="btn-block ml-auto"
            onClick={toggleRepositoryForm}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Can>
  );
};

export default RepositoryActions;
