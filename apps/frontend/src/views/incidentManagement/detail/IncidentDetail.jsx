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
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import AuditShortDetail from "@/views/audits/AuditShortDetail";
import ComplianceStripe from "@/views/compliance/searchableList/components/ComplianceStripe";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import TimeLine from "@/views/shared/Timeline/Timeline";
import TaskManagement from "@/views/taskManagement/Tasks";
import AttachmentButtons from "../AttachmentButtons";
import IncidentActions from "../IncidentActions";
import IncidentOverview from "../IncidentOverview";
import IncidentStatus from "../IncidentStatus";
import USER_ACTIONS from "../actions";
import { useIncident } from "../store";
import IncidentFormContainer from "./IncidentFormContainer";
import PreviousRouteButton from "@/components/PreviousRouteButton/Index";
import Box from "@/components/Box/Index";

const IncidentDetails = ({
  moduleType = "incidents",
  moduleId = null,
  ...props
}) => {
  let {
    visitingIncident: incident,
    processing,
    isResolvedIncident,
    linkISOControl,
    removeISOControl,
    controlsOnVisitingIncident,
  } = useIncident();
  let { authUser } = useAccess();
  let { warningWithConfirmMessage } = useAlerts();
  return (
    <div className="content">
      <h4 className="mb-3 text-primary fw-bold">
        <PreviousRouteButton>
          <i className="fa-solid fa-arrow-left" />
        </PreviousRouteButton>{" "}
        Incident details
      </h4>

      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_INCIDENT].error}
        errorMessage="This incident has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_INCIDENT].status ? (
          <Loading />
        ) : (
          incident && (
            <Row>
              <Col xl="7" md="7" sm="12" className="mb-3">
                <SwitchableView
                  viewTitle={incident.title}
                  canSwitch={
                    !isResolvedIncident() &&
                    authUser({
                      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
                      action: ACTIONS.CREATE,
                      effect: EFFECTS.ALLOW,
                    })
                  }
                >
                  <SecondaryWrapperChild>
                    <IncidentFormContainer />
                  </SecondaryWrapperChild>
                  <PrimaryWrapperChild>
                    <Row>
                      <Col md="12">
                        <DetailsWrapper
                          label={"Description:"}
                          value={incident.description}
                        />
                      </Col>
                      <Col md="12">
                        <DetailsWrapper
                          label={"Affected service:"}
                          value={incident.affectedService}
                        />
                      </Col>
                      <Col md="12">
                        <DetailsWrapper
                          label={"Method of notification:"}
                          value={incident.methodOfNotification}
                        />
                      </Col>
                      <Col md="12" className="">
                        <DetailsWrapper
                          label={"Linked compliance controls:"}
                          iconClass={"tim-icons icon-pencil"}
                          labelClass={"pr-2"}
                        />
                        {processing[
                          USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_INCIDENT
                        ].status && <Loading />}
                        {controlsOnVisitingIncident?.length > 0 &&
                          controlsOnVisitingIncident.map((data) => (
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

                      {incident?.tagsAndCategories && (
                        <Col md="12">
                          <DetailsWrapper
                            label={"Additional Information:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={`Category: ${incident?.tagsAndCategories?.name}`}
                            labelClass={"pr-2"}
                          />
                        </Col>
                      )}
                      <br></br>
                      {incident?.resolved?.status &&
                      incident?.resolution !== "" ? (
                        <Col md="12">
                          <DetailsWrapper
                            label={"Resolution:"}
                            value={incident.resolution}
                          />
                        </Col>
                      ) : null}
                    </Row>
                    <br></br>
                    <DetailsSectionHeader
                      title={`Attachments and evidences:`}
                    />
                    <Row>
                      <Col md="12">
                        <Attachments s3Information={incident?.attachments}>
                          <AttachmentButtons />
                        </Attachments>
                      </Col>
                    </Row>
                    <br></br>

                    {incident?.source?.moduleType === "audits" && (
                      <>
                        <DetailsSectionHeader title={`Audit information`} />
                        <DetailsWrapper label={`Audit detail`} />
                        {incident.source.moduleType === "audits" && (
                          <Row>
                            <Col md="12">
                              <AuditShortDetail
                                audit={incident?.source?.module}
                              />
                            </Col>
                          </Row>
                        )}
                      </>
                    )}
                    <br></br>

                    <br></br>
                  </PrimaryWrapperChild>
                </SwitchableView>
                <TaskManagement moduleType="incidents" module={incident?._id} />
                <Box>
                  <h4>Activities</h4>
                  {isResolvedIncident() ? (
                    <TimeLine
                      readOnly={true}
                      horizontalSpacing={false}
                      containerClass="mx-auto sm-10"
                      moduleType="incidents"
                      moduleId={incident._id}
                      module={incident}
                    />
                  ) : (
                    <TimeLine
                      editLabel="comment"
                      editPlaceholder="Comment"
                      horizontalSpacing={true}
                      containerClass="mx-auto sm-10"
                      moduleType="incidents"
                      moduleId={incident._id}
                      module={incident}
                    />
                  )}
                </Box>
              </Col>
              <Col xl="5" md="5" sm="12">
                <DetailsSidebar
                  title="Details"
                  iconClass="ims-icons-20 icon-document-regular"
                  label={`Raised on ${moment(incident?.created?.on).format(
                    "DD/MM/YYYY"
                  )}`}
                >
                  {authUser({
                    service: IMS_SERVICES.INCIDENT_MANAGEMENT,
                    action: ACTIONS.DELETE,
                    effect: EFFECTS.ALLOW,
                  }) && <IncidentActions />}
                  <IncidentOverview />
                  <IncidentStatus />
                </DetailsSidebar>
              </Col>
            </Row>
          )
        )}
      </ErrorHandlerComponent>
    </div>
  );
};

export default IncidentDetails;
