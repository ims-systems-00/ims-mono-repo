import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
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
import { linkGenerator } from "@/utils/formatLinkGenerator";
import AuditShortDetail from "@/views/audits/AuditShortDetail";
import ComplianceStripe from "@/views/compliance/searchableList/components/ComplianceStripe";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import TimeLine from "@/views/shared/Timeline/Timeline";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import AttachmentsButtons from "../AttachmentsButtons";
import ContinualImprovementAction from "../ContinualImprovementAction";
import ContinualImprovementOverview from "../ContinualImprovementOverview";
import ContinualImprovementStatus from "../ContinualImprovementStatus";
import USER_ACTIONS from "../actions";
import { useCip } from "../store";
import CipFormContainer from "./CipFormContainer";

const CIPDetail = () => {
  let {
    visitingCip: cip,
    processing,
    isImplementedCip,
    controlsOnVisitingCip,
    removeISOControl,
  } = useCip();
  let { authUser } = useAccess();
  let { warningWithConfirmMessage } = useAlerts();
  return (
    <div className="content">
      <h4 className="mb-3 text-primary fw-bold">OFI details</h4>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_CIP].error}
        errorMessage="This OFI has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_CIP].status ? (
          <Loading />
        ) : (
          cip && (
            <>
              <Row>
                <Col xl="5" md="5" sm="12">
                  <DetailsSidebar
                    title="Details"
                    iconClass="ims-icons-20 icon-document-regular"
                    label={`Raised on ${moment(cip?.created?.on).format(
                      "DD/MM/YYYY"
                    )}`}
                  >
                    {!isImplementedCip() && <ContinualImprovementAction />}
                    <ContinualImprovementOverview />
                    <ContinualImprovementStatus />
                  </DetailsSidebar>
                </Col>
                <Col xl="7" md="7" sm="12" className="mb-3">
                  <SwitchableView
                    viewTitle={cip?.title}
                    canSwitch={
                      authUser({
                        service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
                        action: ACTIONS.CREATE,
                        effect: EFFECTS.ALLOW,
                      }) && !isImplementedCip()
                    }
                  >
                    <SecondaryWrapperChild>
                      <CipFormContainer />
                    </SecondaryWrapperChild>
                    <PrimaryWrapperChild>
                      <Row>
                        <Col md="12" className="mb-2">
                          <DetailsSectionFormattedTextWrapper
                            label={"Opportunity for improvement:"}
                          >
                            <FormattedContents
                              value={cip?.opportunityForImprovement}
                              mediaLinkGeneratorFn={linkGenerator}
                            />
                          </DetailsSectionFormattedTextWrapper>
                        </Col>
                        <Col md="12" className="mb-2">
                          <DetailsSectionHeader
                            title={`Linked compliance controls:`}
                          />

                          {processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_CIP]
                            .status && <Loading />}
                          {controlsOnVisitingCip?.length > 0 &&
                            controlsOnVisitingCip.map((data) => (
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
                          <TaskManagement moduleType="cips" module={cip._id} />
                        </Col>
                      </Row>

                      {cip?.source?.moduleType === "audits" && (
                        <>
                          <br></br>
                          <DetailsSectionHeader title={`Audit detail:`} />
                          <Row>
                            <Col md="12">
                              <AuditShortDetail audit={cip?.source?.module} />
                            </Col>
                          </Row>
                        </>
                      )}
                      <br></br>
                      <DetailsSectionHeader title={`Attachments`} />
                      <Row>
                        <Col md="12">
                          <Attachments s3Information={cip?.attachments}>
                            <AttachmentsButtons />
                          </Attachments>
                        </Col>
                      </Row>
                      <br></br>
                      <DetailsSectionHeader title={`Actions`} />
                      <Row>
                        <Col md="12">
                          {isImplementedCip() ? (
                            <TimeLine
                              readOnly={true}
                              horizontalSpacing={true}
                              containerClass="mx-auto sm-10"
                              moduleType="cips"
                              moduleId={cip?._id}
                              module={cip}
                            />
                          ) : (
                            <TimeLine
                              editLabel="Action"
                              editPlaceholder="Action"
                              horizontalSpacing={true}
                              containerClass="mx-auto sm-10"
                              moduleType="cips"
                              moduleId={cip?._id}
                              module={cip}
                            />
                          )}
                        </Col>
                      </Row>
                    </PrimaryWrapperChild>
                  </SwitchableView>
                </Col>
              </Row>
            </>
          )
        )}
      </ErrorHandlerComponent>
    </div>
  );
};

export default CIPDetail;
