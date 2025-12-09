import Box from "@/components/Box/Index";
import FormatedContents from "@/components/Editors/TextEditor/FormattedContents";
import EmptyDetails from "@/components/EmptyDetails";
import Loading from "@/components/Loader/Loading";
import {
  Button,
  Col,
  DrawerOpener,
  DrawerRight,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import AuditShortDetail from "@/views/audits/AuditShortDetail";
import ComplianceStripe from "@/views/compliance/searchableList/components/ComplianceStripe";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import AttachmentButtons from "../AttachmentButtons";
import USER_ACTIONS from "../actions";
import { useIncident } from "../store";
import IncidentFormContainer from "./IncidentFormContainer";
import useAlerts from "@/hooks/useAlerts";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import IncidentOverview from "../IncidentOverview";
import IncidentStatus from "../IncidentStatus";
import moment from "moment";
import IncidentActions from "../IncidentActions";

const IncidentDescription = () => {
  const {
    visitingIncident,
    processing,
    controlsOnVisitingIncident,
    removeISOControl,
  } = useIncident();
  let { warningWithConfirmMessage } = useAlerts();
  const { closeDrawer } = useDrawer();
  return (
    <div className="content">
      <Col md="6" className="mx-auto">
        <Box>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="mb-0">{visitingIncident.title}</h3>
              <small className="text-muted">
                Reference: {visitingIncident.reference}
              </small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <DrawerOpener drawerId="edit-incident-form">
                <Button
                  color="primary"
                  outline
                  size="sm"
                  className="shadow-sm--hover border-0"
                >
                  <i className="ims-icons-20 icon-icon-pencil-24 me-1 p-0"></i>
                </Button>
              </DrawerOpener>
              <IncidentActions />
            </div>
          </div>

          <Row>
            <Col md="12">
              {/* <Box noShadow varient="secondary-extra-light"> */}
              <h5 className="mb-2">
                <span className="icon-container-circle">
                  <i className="ims-icons-20 icon-icon-alert-circle-24" />
                </span>{" "}
                Description
              </h5>
              {visitingIncident.description ? (
                <Box noShadow>
                  <FormatedContents
                    mediaLinkGeneratorFn={linkGenerator}
                    value={visitingIncident.description}
                  />
                </Box>
              ) : (
                <EmptyDetails>
                  <i className="ims-icons-20 icon-icon-alert-circle-24" />
                  <p>No description</p>
                </EmptyDetails>
              )}
              {/* </Box> */}
            </Col>
            <Col md="12">
              {/* <Box noShadow varient="secondary-extra-light"> */}
              <h5 className="mb-2">
                <span className="icon-container-circle">
                  <i className="ims-icons-20 icon-icon-alert-circle-24" />
                </span>{" "}
                Affected service
              </h5>
              {visitingIncident.controlsAndMitigation ? (
                // <Box noShadow>
                <FormatedContents
                  mediaLinkGeneratorFn={linkGenerator}
                  value={visitingIncident.affectedService}
                />
              ) : (
                // </Box>
                <EmptyDetails>
                  <i className="ims-icons-20 icon-icon-alert-circle-24" />
                  <p>No affected service logged</p>
                </EmptyDetails>
              )}
              {/* </Box> */}
            </Col>
            <Col md="12">
              {/* <Box noShadow varient="secondary-extra-light"> */}
              <h5 className="mb-2">
                <span className="icon-container-circle">
                  <i className="ims-icons-20 icon-icon-alert-circle-24" />
                </span>{" "}
                Method of notification
              </h5>
              {visitingIncident.methodOfNotification ? (
                // <Box noShadow>
                <FormatedContents
                  mediaLinkGeneratorFn={linkGenerator}
                  value={visitingIncident.methodOfNotification}
                />
              ) : (
                // </Box>
                <EmptyDetails>
                  <i className="ims-icons-20 icon-icon-alert-circle-24" />
                  <p>No method of notification logged</p>
                </EmptyDetails>
              )}
              {/* </Box> */}
            </Col>
            <Col md="12" className="">
              {processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_INCIDENT]
                .status && <Loading />}
              {controlsOnVisitingIncident?.length > 0 &&
                controlsOnVisitingIncident.map((data) => (
                  <ComplianceStripe
                    key={data._id}
                    compliance={data}
                    warningWithConfirmMessage={warningWithConfirmMessage}
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
                ))}
            </Col>
            {visitingIncident?.tagsAndCategories && (
              <Col md="12">
                <DetailsWrapper
                  label={"Additional Information:"}
                  iconClass={"tim-icons icon-pencil"}
                  value={`Category: ${visitingIncident?.tagsAndCategories?.name}`}
                  labelClass={"pr-2"}
                />
              </Col>
            )}
            {visitingIncident?.resolved?.status &&
              visitingIncident?.resolution !== "" && (
                <Col md="12">
                  <DetailsWrapper
                    label={"Resolution:"}
                    value={visitingIncident.resolution}
                    labelClass={"pr-2"}
                  />
                </Col>
              )}
            {visitingIncident?.attachments?.length > 0 && (
              <Col md="12">
                <DetailsWrapper
                  label={"Attachments"}
                  iconClass={"tim-icons icon-pencil"}
                  value={null}
                  labelClass={"pr-2"}
                />
                <Attachments s3Information={visitingIncident?.attachments}>
                  <AttachmentButtons />
                </Attachments>
              </Col>
            )}
            <br></br>
            {visitingIncident?.source?.moduleType === "audits" && (
              <React.Fragment>
                <DetailsSectionHeader title={`Audit detail`} />
                <Row>
                  <Col md="12">
                    <AuditShortDetail
                      audit={visitingIncident?.source?.module}
                    />
                  </Col>
                </Row>
              </React.Fragment>
            )}
            <Col md="12" className="mt-3">
              <DetailsSidebar
                title="Details"
                iconClass="ims-icons-20 icon-document-regular"
                label={`Raised on ${moment(
                  visitingIncident?.created?.on
                ).format("DD/MM/YYYY")}`}
              >
                {/* {authUser({
                    service: IMS_SERVICES.INCIDENT_MANAGEMENT,
                    action: ACTIONS.DELETE,
                    effect: EFFECTS.ALLOW,
                  }) && <IncidentActions />} */}
                <IncidentOverview />
                <IncidentStatus />
              </DetailsSidebar>
            </Col>
          </Row>
        </Box>

        <DrawerRight drawerId="edit-incident-form">
          {visitingIncident && (
            // // <RiskForm
            // //   visitingRisk={visitingRisk}
            // //   drawerView={true}
            // //   onSubmit={async (formData) => {
            // //     const mutationData = {
            // //       group: formData.group.value,
            // //       type: formData.type.value,
            // //       owner: formData.owner.value,
            // //       asset: formData.asset.value,
            // //       title: formData.title,
            // //       description: formData.description,
            // //       likelihood: parseInt(formData.likelihood.value),
            // //       consequence: parseInt(formData.consequence.value),
            // //       controlsAndMitigation: formData.controlsAndMitigation,
            // //       mitigationStatus: formData.mitigationStatus,
            // //       acceptanceRational: formData.acceptanceRational,
            // //       decisionMaker: formData.decisionMaker,
            // //       acceptanceStatus: formData.acceptanceStatus,
            // //       attachments: formData.attachments,
            // //       tagsAndCategories: formData.tagsAndCategories.value,
            // //     };
            // //     await updateRisk(mutationData);
            // //     closeDrawer("edit-risk-form");
            // //   }}
            // />
            <IncidentFormContainer />
          )}
        </DrawerRight>
      </Col>
    </div>
  );
};

export default IncidentDescription;
