import { Modal, ModalBody, ModalHeader } from "@ims-systems-00/ims-ui-kit";
import React, { useState } from "react";

let cachedUpdate = null;

const useModal = (initializers) => {
  initializers = initializers || {};
  const [view, setView] = useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => {
    isOpen &&
      initializers.onUpdate &&
      initializers.onUpdate(cachedUpdate || view);
    setIsOpen(!isOpen);
  };
  const activateView = (data) => {
    setView(data);
    toggle();
  };
  const onUpdate = (data) => (cachedUpdate = data);
  return {
    Modal: ({ children, ...props }) => (
      <Modal modalClassName={"modal-view show"} isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{props.title}</ModalHeader>
        <ModalBody>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { view, onUpdate, ...props })
          )}
        </ModalBody>
      </Modal>
    ),
    activateView,
    isOpen,
  };
};

export default useModal;
