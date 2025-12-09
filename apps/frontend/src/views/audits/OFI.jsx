import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import NotificationContext from "@/contexts/notificationContext";
import { Button, Col, Row, Spinner } from "@ims-systems-00/ims-ui-kit";
import { useContext, useState } from "react";
import { deleteOfi } from "@/services/auditServices";
import { imsLogger } from "@/services/loggerService";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import { AuditActionsContext } from "./context/AuditActionsContext";
import OfiForm from "./OfiForm";
import { useAudits } from "./store";
import USER_ACTIONS from "./actions";

const OFI = ({ ofi }) => {
  let { ofiEditMode, updateOfi, toggleOfiEditMode, processing, deleteOfi } =
    useAudits();
  return ofiEditMode ? (
    <OfiForm
      ofi={ofi}
      onSubmit={async (data) => {
        await updateOfi(ofi, data);
      }}
    />
  ) : (
    <>
      <Row className="mt-2">
        <Col md="2">
          <span className="text-right font-size-subtitle-1">
            <span className=""> </span>{" "}
            {<i className="ims-icons-20 icon-icon-arrowsquareupright-24" />}{" "}
          </span>
        </Col>
        <Col md="10">
          <Row>
            <Col md="10">
              <span>
                Title
                <span className="text-secondary font-size-subtitle-1">
                  {" "}
                  {ofi.title}{" "}
                </span>
              </span>
            </Col>
            <Col md="2">
              <Button
                className="border-0"
                color="link"
                size="sm"
                onClick={() => toggleOfiEditMode()}
              >
                <i className="ims-icons-20 icon-icon-pencil-24" />
              </Button>{" "}
              <Button
                disabled={
                  processing[USER_ACTIONS.DELETE_OFI].status &&
                  processing[USER_ACTIONS.DELETE_OFI].id === ofi._id
                }
                size="sm"
                color="link"
                className="btn-link-danger border border-0"
                onClick={() => deleteOfi(ofi)}
              >
                {processing[USER_ACTIONS.DELETE_OFI].status &&
                processing[USER_ACTIONS.DELETE_OFI].id === ofi._id ? (
                  <Spinner size="sm" />
                ) : (
                  <i className="ims-icons-20 icon-icon-trash-24" />
                )}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <DetailsSectionFormattedTextWrapper label={"Description:"}>
                <FormattedContents
                  value={ofi.opportunityForImprovement}
                  mediaLinkGeneratorFn={linkGenerator}
                />
              </DetailsSectionFormattedTextWrapper>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default OFI;
