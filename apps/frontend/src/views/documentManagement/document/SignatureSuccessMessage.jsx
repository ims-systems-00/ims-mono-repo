import React from "react";
import { Modal, ModalBody } from "@ims-systems-00/ims-ui-kit";
const SignatureSuccessMessage = ({
  isOpen = false,
  toggle = function () {},
}) => {
  return (
    <Modal centered isOpen={isOpen} toggle={toggle}>
      <ModalBody>
        The document has been signed successfully. A copy will be sent via email
        to the author and the yourself.You can now download a copy.
      </ModalBody>
    </Modal>
  );
};

export default SignatureSuccessMessage;
