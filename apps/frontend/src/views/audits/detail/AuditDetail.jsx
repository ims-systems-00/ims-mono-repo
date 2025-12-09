import Box from "@/components/Box/Index";
import Loading from "@/components/Loader/Loading";
import PreviousRouteButton from "@/components/PreviousRouteButton/Index";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import {
  Badge,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import ComplianceStripe from "@/views/compliance/searchableList/components/ComplianceStripe";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import TaskManagement from "@/views/taskManagement/Tasks";
import { AttachmentButtons } from "../Attachments";
import AuditActions from "../AuditActions";
import AuditOverview from "../AuditOverview";
import AuditStatus from "../AuditStatus";
import ExtractReport from "../ExtractReport";
import USER_ACTIONS from "../actions";
import { useAudits } from "../store";
import AuditFormContainer from "./AuditFormContainer";
import EmptyIndentification from "../EmptyIndentification";
import classNames from "classnames";

function getRiskScoreIndicator(score) {
  if (score < 3) return "success";
  if (score < 5) return "warning";
  return "danger";
}

const AuditDetail = () => {
  let {
    visitingAudit: audit,
    auditType,
    processing,
    kpiObjectives,
    removeISOControl,
    controlsOnVisitingAudit,
    sendAuditReport,
  } = useAudits();
  let {
    authUser,
    authSuperUser,
    authInternalUser,
    authExternalUser,
    entityAccessControl,
  } = useAccess();

  let { warningWithConfirmMessage } = useAlerts();

  function accessControlAmendTab() {
    let permitted = ["Amend audit"];
    let notPermitted = [];
    if (
      authUser({
        service: IMS_SERVICES.AUDIT,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW,
      })
    ) {
      if (authSuperUser()) return permitted;
      if (auditType === "Internal" && authInternalUser()) return permitted;
      if (auditType === "External" && authExternalUser()) return permitted;
    }
    return notPermitted;
  }
  function _accessControlAmendTab() {
    return authUser({
      service: IMS_SERVICES.AUDIT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    })
      ? ["Extract report"]
      : [];
  }
  return (
    <React.Fragment>
      <div className="content">
        <h4 className="mb-3 text-primary fw-bold">
          <PreviousRouteButton>
            <i className="fa-solid fa-arrow-left" />
          </PreviousRouteButton>
          {auditType} audit details
        </h4>
        <ErrorHandlerComponent
          hasError={processing[USER_ACTIONS.LOAD_AUDIT].error}
          errorMessage="This audit has been deleted or removed"
        >
          {processing[USER_ACTIONS.LOAD_AUDIT].status ? (
            <Loading />
          ) : (
            audit && (
              <Row>
                <Col xl="8" md="8" sm="12" className="mb-3">
                  <SwitchableView
                    viewTitle={audit.title}
                    canSwitch={
                      !audit.completed.status &&
                      authUser({
                        service: IMS_SERVICES.AUDIT,
                        action: ACTIONS.CREATE,
                        effect: EFFECTS.ALLOW,
                      }) &&
                      ((auditType === "Internal" && authInternalUser()) ||
                        (auditType === "External" && authExternalUser()) ||
                        authSuperUser()) &&
                      entityAccessControl({
                        users: [
                          audit.created.by && audit.created.by._id,
                          audit.auditor && audit.auditor._id,
                        ],
                        effect: "Allow",
                      })
                    }
                  >
                    <SecondaryWrapperChild>
                      <AuditFormContainer />
                    </SecondaryWrapperChild>
                    <PrimaryWrapperChild>
                      <Box noShadow varient="secondary-extra-light">
                        <h5 className="mb-2">
                          <span className="icon-container-circle">
                            <i className="fas fa-ban" />{" "}
                          </span>
                          Non-conformities{" "}
                        </h5>
                        {audit.identifications.length > 0 ? (
                          audit.identifications.map((identification) => (
                            <Box noShadow key={identification?._id}>
                              <p className="text-dark  mb-3">
                                {" "}
                                {identification?.nonConformity}
                              </p>

                              <p className="mb-2">
                                <strong>Root Causes:-</strong>
                                {identification?.rootCause}
                              </p>
                              {audit?.completed?.status && (
                                <Link
                                  className="text-info"
                                  to={`/admin/incidentmanagement/${identification?._id}`}
                                >
                                  {" "}
                                  View detail...
                                </Link>
                              )}
                            </Box>
                          ))
                        ) : (
                          <EmptyIndentification>
                            <i className="ims-icons-20 icon-icon-alert-circle-24" />
                            <p>No non-confirmity found.</p>
                          </EmptyIndentification>
                        )}
                      </Box>
                      <Box noShadow varient="secondary-extra-light">
                        <h5 className="mb-2">
                          <span className="icon-container-circle">
                            <i className="ims-icons-20 icon-icon-alert-circle-24" />
                          </span>
                          Risks identified
                        </h5>
                        {audit?.risks && audit?.risks.length > 0 ? (
                          <React.Fragment>
                            {audit.risks.map((risk) => (
                              <Box noShadow key={risk?._id}>
                                <p className="text-dark  mb-3">
                                  {" "}
                                  {risk?.title}
                                  <span className="pull-right">
                                    <Badge
                                      fade={getRiskScoreIndicator(
                                        risk.score.likelihood
                                      )}
                                    >
                                      Likelihood {risk.score.likelihood}
                                    </Badge>
                                    <Badge
                                      fade={getRiskScoreIndicator(
                                        risk.score.consequence
                                      )}
                                    >
                                      Consequence {risk.score.consequence}
                                    </Badge>
                                  </span>
                                </p>
                                <p className="mb-2">
                                  {" "}
                                  <strong>Description:-</strong>{" "}
                                  {risk.description}
                                </p>
                                {audit?.completed?.status && (
                                  <Link
                                    className="text-info"
                                    to={`/admin/risks/${risk?._id}`}
                                  >
                                    {" "}
                                    View detail...
                                  </Link>
                                )}
                              </Box>
                            ))}
                          </React.Fragment>
                        ) : (
                          <EmptyIndentification>
                            <i className="ims-icons-20 icon-icon-alert-circle-24" />
                            <p>No risk found.</p>
                          </EmptyIndentification>
                        )}
                      </Box>
                      <Box noShadow varient="secondary-extra-light">
                        <h5 className="mb-2">
                          <span className="icon-container-circle">
                            <i className="ims-icons-20 icon-icon-arrowsquareupright-24"></i>
                          </span>{" "}
                          Opportunities for Improvement
                        </h5>
                        {audit.cips.length > 0 ? (
                          audit.cips.map((cip) => (
                            <Box noShadow key={cip?._id}>
                              <p className="text-dark  mb-3"> {cip?.title}</p>
                              <p className="mb-2">
                                <strong>Focus area:-</strong>{" "}
                                {cip?.opportunityForImprovement}
                              </p>
                              {audit?.completed?.status && (
                                <Link
                                  className="text-info"
                                  to={`/admin/cip/${cip?._id}`}
                                >
                                  {" "}
                                  View detail...
                                </Link>
                              )}
                            </Box>
                          ))
                        ) : (
                          <EmptyIndentification>
                            <i className="ims-icons-20 icon-icon-alert-circle-24" />
                            <p>No OFI found.</p>
                          </EmptyIndentification>
                        )}
                      </Box>
                      <Box noShadow varient="secondary-extra-light">
                        <h5 className="mb-2">
                          <span className="icon-container-circle">
                            <i className="ims-icons-20 icon-icon-arrowsquareupright-24"></i>
                          </span>{" "}
                          Audit summary
                        </h5>
                        {audit?.comment ? (
                          <Box noShadow>{audit?.comment}</Box>
                        ) : (
                          <EmptyIndentification>
                            <i className="ims-icons-20 icon-icon-alert-circle-24" />
                            <p>No summary</p>
                          </EmptyIndentification>
                        )}
                      </Box>
                      <Box noShadow varient="secondary-extra-light">
                        <h5 className="mb-2">
                          <span className="icon-container-circle">
                            <i className="ims-icons-20 icon-icon-shieldcheck-24" />
                          </span>{" "}
                          Linked compliance controls
                        </h5>
                        {processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_AUDIT]
                          .status && <Loading />}
                        {controlsOnVisitingAudit?.length > 0 ? (
                          controlsOnVisitingAudit.map((data) => (
                            <ComplianceStripe
                              key={data._id}
                              compliance={data}
                              warningWithConfirmMessage={
                                warningWithConfirmMessage
                              }
                              actions={
                                <UncontrolledDropdown
                                  size="sm"
                                  direction="left"
                                >
                                  <DropdownToggle
                                    outline
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    className="border"
                                  >
                                    <i className="fa-solid fa-ellipsis-h" />
                                  </DropdownToggle>
                                  <DropdownMenu bottom>
                                    <DropdownItem
                                      onClick={(e) => {
                                        removeISOControl({
                                          toolkits: [],
                                          controls: [data?.control?._id],
                                        });
                                      }}
                                    >
                                      Remove
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              }
                            />
                          ))
                        ) : (
                          <EmptyIndentification>
                            <i className="ims-icons-20 icon-icon-alert-circle-24" />
                            <p>No control linked</p>
                          </EmptyIndentification>
                        )}
                      </Box>

                      <DetailsSectionHeader title={`:`} />
                      <Box noShadow varient="secondary-extra-light">
                        <h5 className="mb-2">
                          <span className="icon-container-circle">
                            <i className="ims-icons-20 icon-icon-shieldcheck-24" />
                          </span>{" "}
                          Attachments and evidences
                        </h5>
                        {audit?.attachments?.length ? (
                          <Attachments s3Information={audit?.attachments}>
                            <AttachmentButtons />
                          </Attachments>
                        ) : (
                          <EmptyIndentification>
                            <i className="ims-icons-20 icon-icon-alert-circle-24" />
                            <p>No attachment here</p>
                          </EmptyIndentification>
                        )}
                      </Box>
                    </PrimaryWrapperChild>
                  </SwitchableView>
                  <TaskManagement moduleType="audits" module={audit?._id} />
                </Col>
                <Col xl="4" md="4" sm="12">
                  <DetailsSidebar
                    title="Details"
                    iconClass="ims-icons-20 icon-document-regular"
                    label={`Raised on ${moment(audit?.created?.on).format(
                      "DD/MM/YYYY"
                    )}`}
                  >
                    <AuditActions />
                    <AuditOverview />
                    <AuditStatus />
                    <Box>
                      <ErrorHandlerComponent
                        hasError={processing[USER_ACTIONS.LOAD_AUDIT].error}
                        errorMessage="This audit has been deleted or removed"
                      >
                        <h5 className="mb-3">Extract report</h5>{" "}
                        <ExtractReport
                          onSubmit={async (data) => {
                            await sendAuditReport(data);
                          }}
                        />
                      </ErrorHandlerComponent>
                    </Box>
                  </DetailsSidebar>
                </Col>
              </Row>
            )
          )}
        </ErrorHandlerComponent>
      </div>
    </React.Fragment>
  );
};

export default AuditDetail;
