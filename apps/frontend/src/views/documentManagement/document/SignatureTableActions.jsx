import React from "react";
import useDualStateController from "@/hooks/useDualStateController";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "@ims-systems-00/ims-ui-kit";
import { getCurrentSessionData } from "@/services/authService";
import { downloadFile } from "@/services/fileHandlerService";
import DocumentPreviewPopUp from "./DocumentPreviewPopup";
import useDocument from "./store/useDocument";
const NodeActions = ({ signature }) => {
  let { isOpen: isActionOpen, toggle: toggleActions } =
    useDualStateController();
  const { isOpen: isSignedDocumentOpen, toggle: toggleSignedDocument } =
    useDualStateController();
  const {
    removeSignatures,
    hasOwnership,
    resendInternalSignature,
    resendExternalSignature,
    hasSignatureByTheInternalUser,
  } = useDocument();
  return (
    <React.Fragment>
      {signature?.data?.signedCopy && (
        <DocumentPreviewPopUp
          isOpen={isSignedDocumentOpen}
          toggle={toggleSignedDocument}
          attachment={signature?.data?.signedCopy}
        />
      )}
      <Dropdown size="sm" isOpen={isActionOpen} toggle={toggleActions}>
        <DropdownToggle
          data-display="static"
          disabled={!getCurrentSessionData()?.user?._id}
          className="btn-icon ml-auto"
        >
          <i className="fa-solid fa-ellipsis-vertical three-dots"></i>
        </DropdownToggle>
        <DropdownMenu right>
          {signature?.status === "Signed" &&
            (hasOwnership(getCurrentSessionData()?.user?._id) ||
              signature?.user?.internalRef?._id ===
                getCurrentSessionData()?.user?._id) && (
              <React.Fragment>
                <DropdownItem
                  onClick={() => downloadFile(signature?.data?.signedCopy)}
                >
                  <i className="fa-solid fa-download" /> Download copy
                </DropdownItem>
                <DropdownItem onClick={toggleSignedDocument}>
                  <i className="fa-solid fa-eye" /> View copy
                </DropdownItem>
              </React.Fragment>
            )}
          {hasOwnership(getCurrentSessionData()?.user?._id) &&
            signature?.status !== "Signed" && (
              <DropdownItem
                onClick={() => {
                  removeSignatures({ signatures: [signature?._id] });
                }}
              >
                <i className="fa-solid fa-trash-can" /> Remove
              </DropdownItem>
            )}
          {hasOwnership(getCurrentSessionData()?.user?._id) &&
            signature?.status === "Pending" &&
            signature.type === "External" && (
              <DropdownItem
                onClick={() => {
                  resendExternalSignature({ signatures: [signature?._id] });
                }}
              >
                <i className="ims-icons-20 icon-icon-arrowuupright-24" /> Resend
                signature request
              </DropdownItem>
            )}
          {hasOwnership(getCurrentSessionData()?.user?._id) &&
            signature?.status === "Pending" &&
            signature.type === "Internal" && (
              <DropdownItem
                onClick={() => {
                  resendInternalSignature({ signatures: [signature?._id] });
                }}
              >
                <i className="ims-icons-20 icon-icon-arrowuupright-24" /> Resend
                signature request
              </DropdownItem>
            )}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NodeActions;
