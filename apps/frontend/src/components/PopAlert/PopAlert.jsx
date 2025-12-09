import React from "react";
import {
  UncontrolledPopover,
  PopoverBody,
  Button,
} from "@ims-systems-00/ims-ui-kit";

const PopAlert = ({
  onCancel,
  onConfirm,
  message,
  confirmText,
  target,
  openState = false,
  handleOpenState,
}) => {
  return (
    <UncontrolledPopover
      trigger="legacy"
      placement="bottom"
      isOpen={openState}
      target={target}
      toggle={() => {
        handleOpenState();
      }}
    >
      <PopoverBody className="border shadow-md me-3 rounded">
        <p className="mb-2 font-size-subtitle-1 text-dark text-capitalize">
          {confirmText}
        </p>
        <p className="mb-0 font-size-body-2 text-secondary ">{message}</p>
        <Button
          size="sm"
          color="danger"
          outline
          onClick={() => {
            onCancel();
          }}
          className="inline-block mt-3 rounded"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          color="primary"
          outline
          onClick={() => {
            onConfirm();
          }}
          className="inline-block mt-3 ml-3 rounded"
        >
          Confirm
        </Button>
      </PopoverBody>
    </UncontrolledPopover>
  );
};

export default PopAlert;
