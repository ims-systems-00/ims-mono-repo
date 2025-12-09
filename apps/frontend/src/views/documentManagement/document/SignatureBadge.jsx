import useDualStateController from "@/hooks/useDualStateController";
import moment from "moment";
import React from "react";
import { Button, Card, CardBody } from "@ims-systems-00/ims-ui-kit";
import { getCurrentSessionData } from "@/services/authService";
import { downloadFile } from "@/services/fileHandlerService";
import DocumentPreviewPopUp from "./DocumentPreviewPopup";
import useDocument from "./store/useDocument";
const SignatureBadge = ({}) => {
  const { hasSignatureByTheInternalUser } = useDocument();
  const signature = hasSignatureByTheInternalUser(
    getCurrentSessionData()?.user?._id
  );
  const { isOpen: isDocumentPreviewOpen, toggle: toggleDocumentPreview } =
    useDualStateController();
  return (
    <React.Fragment>
      {signature && (
        <Card>
          <DocumentPreviewPopUp
            isOpen={isDocumentPreviewOpen}
            toggle={toggleDocumentPreview}
            attachment={signature?.data?.signedCopy}
          />
          <CardBody>
            <span className="">
              Signed:{" "}
              <span className={`text-${signature.data?.font} text-primary`}>
                {signature.data?.signature}
              </span>
            </span>
            <span>
              Date:{" "}
              <span className={`text-secondary`}>
                {moment(signature?.signedAt).format("DD/MM/YYYY")}
              </span>
            </span>
            <Button
              size="sm"
              color="primary"
              className="btn-block mb-2"
              onClick={() => downloadFile(signature.data?.signedCopy)}
            >
              <i className="fa-solid fa-download" /> Download copy
            </Button>
            <Button
              size="sm"
              color="primary"
              className="btn-block m-0"
              onClick={toggleDocumentPreview}
            >
              <i className="fa-solid fa-eye" /> Preview
            </Button>
          </CardBody>
        </Card>
      )}
    </React.Fragment>
  );
};

export default SignatureBadge;
