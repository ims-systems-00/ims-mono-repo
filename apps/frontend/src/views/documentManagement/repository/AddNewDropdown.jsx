import useDualStateController from "@/hooks/useDualStateController";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
} from "@ims-systems-00/ims-ui-kit";
import FolderForm from "./FolderForm";
import useRepository from "./store/useRepository";
import UploadFileForm from "./UploadFileForm";
const AddNewDropdown = ({}) => {
  const { createFileNode, createFolderNode, isAllowedToUpload } =
    useRepository();
  const { isOpen: isCreateForlderFormOpen, toggle: toggleCreateFolderForm } =
    useDualStateController();
  const { isOpen: isUploadFileFormOpen, toggle: toggleUploadFileForm } =
    useDualStateController();
  const { isOpen: isDropdownOpen, toggle: toggleDropDown } =
    useDualStateController();
  return (
    <>
      <Dropdown isOpen={isDropdownOpen} toggle={toggleDropDown}>
        <DropdownToggle color="primary" className="mx-1">
          <i className="fa-solid fa-plus" /> Add New
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={toggleCreateFolderForm}>
            <i className="fa-solid fa-folder-plus" /> Create folder
          </DropdownItem>
          <DropdownItem onClick={toggleUploadFileForm}>
            <i className="fa-solid fa-file-arrow-up" /> Upload file
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        isOpen={isUploadFileFormOpen}
        toggle={toggleUploadFileForm}
        centered
      >
        <ModalBody>
          <UploadFileForm
            onSubmit={async (data) => {
              if (isAllowedToUpload(data)) return;
              await createFileNode(data);
              toggleUploadFileForm();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleUploadFileForm}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={isCreateForlderFormOpen}
        toggle={toggleCreateFolderForm}
        centered
      >
        <ModalBody>
          <FolderForm
            onSubmit={async (data) => {
              await createFolderNode(data);
              toggleCreateFolderForm();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleCreateFolderForm}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AddNewDropdown;
