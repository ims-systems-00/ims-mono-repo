import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import NotificationContext from "@/contexts/notificationContext";
import { Button, Col, Row, Spinner } from "@ims-systems-00/ims-ui-kit";
import { useContext, useState } from "react";
import { deleteRisk } from "@/services/auditServices";
import { imsLogger } from "@/services/loggerService";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import { AuditActionsContext } from "./context/AuditActionsContext";
import RiskForm from "./RiskForm";
import { useAudits } from "./store";
import USER_ACTIONS from "./actions";

const Risk = ({ risk }) => {
  let { riskEditMode, updateRisk, toggleRiskEditMode, processing, deleteRisk } =
    useAudits();
  return riskEditMode ? (
    <RiskForm
      risk={risk}
      onSubmit={async (data) => {
        await updateRisk(risk, data);
      }}
    />
  ) : (
    <>
      <Row className="mt-2">
        <Col md="2">
          <span className="text-right font-size-subtitle-1">
            <span className=""> </span>{" "}
            {<i className="ims-icons-20 icon-icon-alert-circle-24" />}{" "}
          </span>
        </Col>
        <Col md="10">
          <Row>
            <Col md="5">
              <span>
                Title:
                <span className="text-secondary font-size-subtitle-1">
                  {" "}
                  {risk.title}{" "}
                </span>
              </span>
            </Col>
            <Col md="5">
              <span>
                Likelihood{" "}
                {risk.score.likelihood < 3 ? (
                  <span className="text-success">{risk.score.likelihood}</span>
                ) : risk.score.consequence === 3 ? (
                  <span className="text-warning">{risk.score.likelihood}</span>
                ) : (
                  <span className="text-danger">{risk.score.likelihood}</span>
                )}{" "}
                Consequence{" "}
                {risk.score.consequence < 3 ? (
                  <span className="text-success">{risk.score.consequence}</span>
                ) : risk.score.consequence === 3 ? (
                  <span className="text-warning">{risk.score.consequence}</span>
                ) : (
                  <span className="text-danger">{risk.score.consequence}</span>
                )}{" "}
              </span>
            </Col>
            <Col md="2">
              <Button
                size="sm"
                className="border-0"
                color="link"
                onClick={() => toggleRiskEditMode()}
              >
                <i className="ims-icons-20 icon-icon-pencil-24" />
              </Button>{" "}
              <Button
                disabled={
                  processing[USER_ACTIONS.DELETE_RISK].status &&
                  processing[USER_ACTIONS.DELETE_RISK].id === risk._id
                }
                size="sm"
                color="link"
                className="btn-link-danger border border-0"
                onClick={() => deleteRisk(risk)}
              >
                {processing[USER_ACTIONS.DELETE_RISK].status &&
                processing[USER_ACTIONS.DELETE_RISK].id === risk._id ? (
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
                  value={risk.description}
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

export default Risk;
