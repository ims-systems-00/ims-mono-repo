import React from "react";
import { Button, Card, CardBody } from "@ims-systems-00/ims-ui-kit";
import { getCurrentSessionData } from "@/services/authService";
import useDocument from "./store/useDocument";
import useAccess from "@/hooks/useAccess";
const SignatureRequestCard = ({ onSignatureOpen = function () {} }) => {
  const {
    document,
    hasPendingSignatureByTheInternalUser,
    getSignatureDataForExternalUser,
  } = useDocument();
  const { hasLimitedAccess } = useAccess();
  const signature =
    hasPendingSignatureByTheInternalUser(getCurrentSessionData()?.user?._id) ||
    getSignatureDataForExternalUser(hasLimitedAccess()?.email);
  return (
    <React.Fragment>
      {signature && (
        <Card>
          <CardBody>
            {signature?.message && (
              <React.Fragment>
                <span className="font-size-subtitle-2">
                  Message from {document?.created?.by?.name}:{" "}
                  <span className="text-secondary">{signature?.message}</span>
                </span>
                <hr className="bg-secondary" />
              </React.Fragment>
            )}
            <span className="text-secondary">
              Please read through the document carefully before signing.
            </span>
            <Button
              color="primary"
              size="sm"
              className="btn-block"
              onClick={(e) => {
                e.preventDefault();
                onSignatureOpen();
              }}
            >
              Sign this document
            </Button>
          </CardBody>
        </Card>
      )}
    </React.Fragment>
  );
};

export default SignatureRequestCard;
