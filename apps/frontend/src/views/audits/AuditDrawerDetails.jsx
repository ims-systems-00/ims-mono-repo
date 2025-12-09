import Loading from "@/components/Loader/Loading";
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Link } from "react-router-dom";
import ComplianceStripe from "@/views/compliance/searchableList/components/ComplianceStripe";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import { AttachmentButtons } from "./Attachments";
import AuditOverview from "./AuditOverview";
import AuditStatus from "./AuditStatus";
import USER_ACTIONS from "./actions";
import { useAudits } from "./store";
import { truncate } from "@/utils/truncate";
import NavigationTabs from "@/components/NavigationTabs";

const AuditDrawerDetail = () => {
  let {
    processing,
    visitingAudit: audit,
    removeISOControl,
    controlsOnVisitingAudit,
    warningWithConfirmMessage,
  } = useAudits();
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_AUDIT].status ? (
        <Loading />
      ) : (
        audit && (
          <React.Fragment>
            <DetailsDrawerHeader data={audit} />
            <NavigationTabs
              container={false}
              activeTab="overview"
              navigations={[
                {
                  id: "overview",
                  text: "Overview",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  ),
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mb-3">
                        <AuditOverview />
                      </div>
                    </div>
                  ),
                },
                {
                  id: "details",
                  text: "Details",
                  icon: <i className="ims-icons-20 icon-icon-list-24 me-1"></i>,
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mb-3">
                        <p className="text-dark">
                          <span>
                            <strong>Non-conformities</strong>
                          </span>{" "}
                        </p>
                        <Row>
                          <Col md="12" className="mb-4">
                            {audit.identifications.length > 0
                              ? audit.identifications.map((identification) => (
                                  <Row
                                    key={identification?._id}
                                    className="mb-3"
                                  >
                                    <Col md="12">
                                      <p className="text-secondary">
                                        <span>
                                          <strong>
                                            {" "}
                                            <i className="fas fa-ban" />{" "}
                                            Non-conformity:
                                          </strong>
                                        </span>{" "}
                                        {identification?.nonConformity}
                                      </p>

                                      {/* </span> */}
                                    </Col>
                                    <Col md="12">
                                      {/* <DetailsSectionContent
                                        label={"Root causes:"}
                                        value={identification?.rootCause}
                                      /> */}
                                      <span>
                                        <strong>Root Causes:</strong>
                                      </span>
                                      <p>{identification?.rootCause}</p>
                                      {audit?.completed?.status && (
                                        <Link
                                          className="text-info"
                                          to={`/admin/incidentmanagement/${identification?._id}`}
                                        >
                                          {" "}
                                          View detail...
                                        </Link>
                                      )}
                                    </Col>
                                  </Row>
                                ))
                              : "None"}
                          </Col>
                          <Col>
                            <p className="text-dark">
                              <span>
                                <strong>Risks</strong>
                              </span>{" "}
                            </p>
                            <Row>
                              <Col md="12" className="mb-4">
                                {audit?.risks && audit?.risks.length > 0 ? (
                                  <React.Fragment>
                                    {audit.risks.map((risk) => (
                                      <Row key={risk?._id} className="mb-3">
                                        <Col md="12">
                                          <span className="text-link">
                                            <strong>
                                              <i className="ims-icons-20 icon-icon-alert-circle-24" />{" "}
                                              Title:{" "}
                                            </strong>
                                            <span className="text-secondary">
                                              {risk?.title}
                                            </span>
                                          </span>
                                        </Col>
                                        <Col md="5">
                                          <span className="">
                                            Likelihood:{" "}
                                            {risk.score.likelihood < 3 ? (
                                              <span className="text-success">
                                                {risk.score.likelihood}
                                              </span>
                                            ) : risk.score.likelihood < 5 ? (
                                              <span className="text-warning">
                                                {risk.score.likelihood}
                                              </span>
                                            ) : (
                                              <span className="text-danger">
                                                {risk.score.likelihood}
                                              </span>
                                            )}
                                          </span>
                                        </Col>
                                        <Col md="5">
                                          <span className="">
                                            Consequences:{" "}
                                            {risk.score.consequence < 3 ? (
                                              <span className="text-success">
                                                {risk.score.consequence}
                                              </span>
                                            ) : risk.score.consequence < 5 ? (
                                              <span className="text-warning">
                                                {risk.score.consequence}
                                              </span>
                                            ) : (
                                              <span className="text-danger">
                                                {risk.score.consequence}
                                              </span>
                                            )}
                                          </span>
                                        </Col>
                                        <Col md="12">
                                          <span>
                                            <strong>Description:</strong>
                                          </span>
                                          <p>
                                            {" "}
                                            {truncate(risk.description, 150)}
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
                                        </Col>
                                      </Row>
                                    ))}
                                  </React.Fragment>
                                ) : (
                                  "None"
                                )}
                              </Col>
                            </Row>
                            <p className="text-dark">
                              <span>
                                <strong>Opportunity for improvements:</strong>
                              </span>{" "}
                            </p>
                            <Row>
                              <Col md="12" className="mb-4">
                                {audit.cips.length > 0
                                  ? audit.cips.map((cip) => (
                                      <Row key={cip?._id} className="mb-3">
                                        <Col md="12">
                                          {/* <span className=""> */}
                                          <p className="text-secondary">
                                            <span>
                                              <strong>
                                                {" "}
                                                <i className="fas fa-ban" />{" "}
                                                Title:
                                              </strong>
                                            </span>{" "}
                                            {cip?.title}
                                          </p>
                                        </Col>
                                        <Col md="12">
                                          {/* <DetailsSectionContent
                                        label={"Root causes:"}
                                        value={identification?.rootCause}
                                      /> */}
                                          <span>
                                            <strong>Focus area:</strong>
                                          </span>
                                          <p>
                                            {" "}
                                            {truncate(
                                              cip?.opportunityForImprovement,
                                              150
                                            )}
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
                                        </Col>
                                      </Row>
                                    ))
                                  : "None"}
                              </Col>
                            </Row>

                            <p className="text-dark">
                              <span>
                                <strong>Audit summary:</strong>
                              </span>{" "}
                            </p>
                            <DetailsSectionContent
                              label={""}
                              value={audit?.comment}
                            />
                            <br></br>
                            <DetailsSectionHeader
                              title={`Attachments and evidences:`}
                            />
                            <Row>
                              <Col md="12">
                                <Attachments s3Information={audit?.attachments}>
                                  <AttachmentButtons />
                                </Attachments>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "lifeCycle",
                  text: "Life Cycle",
                  icon: (
                    <i className="ims-icons-20 icon-icon-clock-24 me-1"></i>
                  ),
                  component: (
                    <div className=" px-2 pt-3">
                      <AuditStatus />
                    </div>
                  ),
                },

                {
                  id: "tasks",
                  text: "Tasks",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notepad-24 me-1"></i>
                  ),
                  component: (
                    <TaskManagement moduleType="audits" module={audit._id} />
                  ),
                },
                {
                  id: "linkedControls",
                  text: "Linked controls",
                  icon: (
                    <i className="ims-icons-20 icon-icon-shieldcheck-24 me-1"></i>
                  ),
                  component: (
                    <div className="pt-3">
                      {processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_AUDIT]
                        .status && <Loading />}
                      {controlsOnVisitingAudit.length > 0 &&
                      !processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_AUDIT]
                        .status ? (
                        controlsOnVisitingAudit.map((data) => (
                          <ComplianceStripe
                            warningWithConfirmMessage={
                              warningWithConfirmMessage
                            }
                            key={data._id}
                            compliance={data}
                            actions={
                              <UncontrolledDropdown size="sm" direction="right">
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
                        <p className="text-secondary text-center">
                          There are no controls linked to this
                        </p>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
};

export default AuditDrawerDetail;
