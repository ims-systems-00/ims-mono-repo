import NotificationContext from "@/contexts/notificationContext";
import { Button, Col, Row, Spinner } from "@ims-systems-00/ims-ui-kit";
import { useContext, useState } from "react";
import { deleteIdentifications } from "@/services/auditServices";
import { imsLogger } from "@/services/loggerService";
import { AuditActionsContext } from "./context/AuditActionsContext";
import IdentificationFrom from "./IdentificationFrom";
import { useAudits } from "./store";
import { updateIdentifications } from "@/services/auditServices";
import USER_ACTIONS from "./actions";

const Identification = ({ identification }) => {
  let {
    identificationEditMode,
    updateIdentification,
    toggleIdentificationEditMode,
    processing,
    deleteIdentification,
  } = useAudits();
  return (
    <>
      {identificationEditMode ? (
        <div className="content mt-3">
          <IdentificationFrom
            identification={identification}
            onSubmit={async (data) => {
              await updateIdentification(identification, data);
            }}
          />
        </div>
      ) : (
        <div className="content mt-3">
          <Row>
            <Col md="2">
              <span className="text-right">
                <i className="ims-icons-20 icon-icon-prohibit-24" />
              </span>
            </Col>
            <Col md="10">
              <Row>
                <Col md="3">
                  <span>
                    Non-conformity :
                    <span className="text-secondary">
                      {" "}
                      {identification.nonConformity}{" "}
                    </span>
                  </span>
                </Col>
                <Col md="7">
                  <span>
                    Root cause :
                    <span className="text-secondary">
                      {" "}
                      {identification.rootCause}{" "}
                    </span>
                  </span>
                </Col>
                <Col md="2">
                  <Button
                    size="sm"
                    className="border-0"
                    color="link"
                    onClick={() => {
                      toggleIdentificationEditMode();
                    }}
                  >
                    <i className="ims-icons-20 icon-icon-pencil-24" />
                  </Button>{" "}
                  <Button
                    disabled={
                      processing[USER_ACTIONS.DELETE_IDENTIFICATION].status &&
                      processing[USER_ACTIONS.DELETE_IDENTIFICATION].id ===
                        identification._id
                    }
                    size="sm"
                    color="link"
                    className="btn-link-danger border border-0"
                    onClick={() => deleteIdentification(identification)}
                  >
                    {processing[USER_ACTIONS.DELETE_IDENTIFICATION].status &&
                    processing[USER_ACTIONS.DELETE_IDENTIFICATION].id ===
                      identification._id ? (
                      <Spinner size="sm" />
                    ) : (
                      <i className="ims-icons-20 icon-icon-trash-24" />
                    )}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default Identification;
