import FilePreviwer from "@/components/Previewer/FilePreviewer";
import { Modal, ModalBody } from "@ims-systems-00/ims-ui-kit";
export function Preview({ isOpen, toggle, data }) {
  return (
    <Modal modalClassName={"modal-view show"} isOpen={isOpen} toggle={toggle}>
      <ModalBody>
        <FilePreviwer fileDetails={data} />
      </ModalBody>
    </Modal>
  );
}
