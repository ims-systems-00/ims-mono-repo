import Loading from "@/components/Loader/Loading";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import AuditShortDetail from "@/views/audits/AuditShortDetail";
import ComplianceStripe from "@/views/compliance/searchableList/components/ComplianceStripe";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Timeline from "@/views/shared/Timeline/Timeline";
import Tasks from "@/views/taskManagement/Tasks";
import AttachmentButtons from "../AttachmentButtons";
import RiskActions from "../RiskActions";
import RiskOverview from "../RiskOverview";
import RiskScore from "../RiskScore";
import RiskStatus from "../RiskStatus";
import USER_ACTIONS from "../actions";
import { useRisk } from "../store";
import RiskFormContainer from "./RiskFormContainer";
import Box from "@/components/Box/Index";
import PreviousRouteButton from "@/components/PreviousRouteButton/Index";
import FormatedContents from "@/components/Editors/TextEditor/FormattedContents";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import EmptyDetails from "@/components/EmptyDetails";

const RiskDetail = () => {
  const {
    visitingRisk,
    processing,
    pathname,
    controlsOnVisitingRisk,
    removeISOControl,
  } = useRisk();
  let { authUser } = useAccess();
  let { warningWithConfirmMessage } = useAlerts();
  const getSubmissionStatus = (risk) => {
    return risk.mitigated.status;
  };
  return (
    <div className="content">
      <h4 className="mb-3 text-primary fw-bold">
        <PreviousRouteButton>
          <i className="fa-solid fa-arrow-left" />
        </PreviousRouteButton>{" "}
        Risk details
      </h4>
      <React.Fragment>
        <ErrorHandlerComponent
          hasError={processing[USER_ACTIONS.LOAD_RISK].error}
          errorMessage="This risk has been deleted or removed"
        >
          {processing[USER_ACTIONS.LOAD_RISK].status ? (
            <Loading />
          ) : (
            visitingRisk && (
              <Row>
                <Col xl="8" sm="12" className="mb-3">
                  <SwitchableView
                    viewTitle={visitingRisk.title}
                    canSwitch={
                      !getSubmissionStatus(visitingRisk) &&
                      authUser({
                        service: IMS_SERVICES.RISK_MANAGEMENT,
                        action: ACTIONS.CREATE,
                        effect: EFFECTS.ALLOW,
                      })
                    }
                  >
                    <SecondaryWrapperChild>
                      <RiskFormContainer />
                    </SecondaryWrapperChild>
                    <PrimaryWrapperChild>
                      <Row>
                        <Col md="12">
                          <Box noShadow varient="secondary-extra-light">
                            <h5 className="mb-2">
                              <span className="icon-container-circle">
                                <i className="ims-icons-20 icon-icon-alert-circle-24" />
                              </span>{" "}
                              Description
                            </h5>
                            {visitingRisk.description ? (
                              <Box noShadow>
                                <FormatedContents
                                  mediaLinkGeneratorFn={linkGenerator}
                                  value={visitingRisk.description}
                                />
                              </Box>
                            ) : (
                              <EmptyDetails>
                                <i className="ims-icons-20 icon-icon-alert-circle-24" />
                                <p>No description</p>
                              </EmptyDetails>
                            )}
                          </Box>
                        </Col>
                        <Col md="12">
                          <Box noShadow varient="secondary-extra-light">
                            <h5 className="mb-2">
                              <span className="icon-container-circle">
                                <i className="ims-icons-20 icon-icon-alert-circle-24" />
                              </span>{" "}
                              Mitigations
                            </h5>
                            {visitingRisk.controlsAndMitigation ? (
                              <Box noShadow>
                                <FormatedContents
                                  mediaLinkGeneratorFn={linkGenerator}
                                  value={visitingRisk.controlsAndMitigation}
                                />
                              </Box>
                            ) : (
                              <EmptyDetails>
                                <i className="ims-icons-20 icon-icon-alert-circle-24" />
                                <p>No mitigation logged</p>
                              </EmptyDetails>
                            )}
                          </Box>
                        </Col>
                        <Col md="12" className="">
                          {processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_RISK]
                            .status && <Loading />}
                          {controlsOnVisitingRisk?.length > 0 &&
                            controlsOnVisitingRisk.map((data) => (
                              <ComplianceStripe
                                key={data._id}
                                compliance={data}
                                warningWithConfirmMessage={
                                  warningWithConfirmMessage
                                }
                                actions={
                                  <UncontrolledDropdown
                                    size="sm"
                                    direction="right"
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
                            ))}
                        </Col>
                        <Col md="12">
                          <DetailsWrapper
                            label={"Acceptance rationale:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={visitingRisk.acceptanceRational}
                            labelClass={"pr-2"}
                          />
                        </Col>
                        {visitingRisk?.tagsAndCategories && (
                          <Col md="12">
                            <DetailsWrapper
                              label={"Additional Information:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={`Category: ${visitingRisk?.tagsAndCategories?.name}`}
                              labelClass={"pr-2"}
                            />
                          </Col>
                        )}
                        {visitingRisk?.attachments?.length > 0 && (
                          <Col md="12">
                            <DetailsWrapper
                              label={"Attachments"}
                              iconClass={"tim-icons icon-pencil"}
                              value={null}
                              labelClass={"pr-2"}
                            />
                            <Attachments
                              s3Information={visitingRisk?.attachments}
                            >
                              <AttachmentButtons />
                            </Attachments>
                          </Col>
                        )}
                        <br></br>
                        <Col md="12">
                          <DetailsWrapper
                            label={"Risk score"}
                            iconClass={"tim-icons icon-pencil"}
                            labelClass={"pr-2"}
                          />

                          <RiskScore risk={visitingRisk} />
                        </Col>
                        {visitingRisk?.source?.moduleType === "audits" && (
                          <React.Fragment>
                            <DetailsSectionHeader title={`Audit detail`} />
                            <Row>
                              <Col md="12">
                                <AuditShortDetail
                                  audit={visitingRisk?.source?.module}
                                />
                              </Col>
                            </Row>
                          </React.Fragment>
                        )}
                      </Row>
                    </PrimaryWrapperChild>
                  </SwitchableView>
                  <Tasks moduleType="risks" module={visitingRisk?._id} />
                  <Box>
                    <h4>Activities</h4>
                    {getSubmissionStatus(visitingRisk) ? (
                      <Timeline
                        readOnly={true}
                        horizontalSpacing={false}
                        containerClass="mx-auto sm-12"
                        moduleType="risks"
                        moduleId={visitingRisk?._id}
                      />
                    ) : (
                      <Timeline
                        editLabel="Comment"
                        editPlaceholder="New comment"
                        horizontalSpacing={true}
                        containerClass="mx-auto sm-12"
                        moduleType="risks"
                        moduleId={visitingRisk?._id}
                        isHorizontal={false}
                      />
                    )}
                  </Box>
                </Col>
                <Col xl="4" sm="12">
                  <DetailsSidebar
                    title="Details"
                    label={`Raised on ${moment(
                      visitingRisk?.created?.on
                    ).format("DD/MM/YYYY")}`}
                  >
                    <RiskActions />
                    <RiskOverview />
                    <RiskStatus />
                  </DetailsSidebar>
                </Col>
              </Row>
            )
          )}
        </ErrorHandlerComponent>
      </React.Fragment>
    </div>
  );
};

export default RiskDetail;
