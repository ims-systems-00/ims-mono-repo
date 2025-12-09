import FilePreview from "@/components/Previewer/FilePreviewer";
import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from "@ims-systems-00/ims-ui-kit";
const DocumentPreviewPopUp = ({ isOpen, toggle, attachment }) => {
  return (
    <Modal modalClassName="modal-view" centered isOpen={isOpen} toggle={toggle}>
      <ModalBody>
        {attachment && <FilePreview fileDetails={attachment} />}
      </ModalBody>
      <ModalFooter>
        <Button
          size="sm"
          className=" btn-block ml-auto"
          color="danger"
          onClick={toggle}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DocumentPreviewPopUp;
