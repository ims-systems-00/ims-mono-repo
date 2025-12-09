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
import RiskActionsDropDown from "../RiskActionsDropDown";
import RiskForm from "../RiskForm";
import RiskOverview from "../RiskOverview";
import RiskScore from "../RiskScore";
import RiskStatus from "../RiskStatus";
import USER_ACTIONS from "../actions";
import { useRisk } from "../store";

const RiskDescription = () => {
  const {
    visitingRisk,
    processing,
    controlsOnVisitingRisk,
    removeISOControl,
    warningWithConfirmMessage,
    updateRisk,
  } = useRisk();
  const { closeDrawer } = useDrawer();
  return (
    <div className="content">
      <Col md="6" className="mx-auto">
        <Box>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="mb-0">{visitingRisk.title}</h3>
              <small className="text-muted">
                Reference: {visitingRisk.reference}
              </small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <DrawerOpener drawerId="edit-risk-form">
                <Button
                  color="primary"
                  outline
                  size="sm"
                  className="shadow-sm--hover border-0"
                >
                  <i className="ims-icons-20 icon-icon-pencil-24 me-1 p-0"></i>
                </Button>
              </DrawerOpener>
              <RiskActionsDropDown />
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
              {/* </Box> */}
            </Col>
            <Col md="12">
              {/* <Box noShadow varient="secondary-extra-light"> */}
              <h5 className="mb-2">
                <span className="icon-container-circle">
                  <i className="ims-icons-20 icon-icon-alert-circle-24" />
                </span>{" "}
                Mitigations
              </h5>
              {visitingRisk.controlsAndMitigation ? (
                // <Box noShadow>
                <FormatedContents
                  mediaLinkGeneratorFn={linkGenerator}
                  value={visitingRisk.controlsAndMitigation}
                />
              ) : (
                // </Box>
                <EmptyDetails>
                  <i className="ims-icons-20 icon-icon-alert-circle-24" />
                  <p>No mitigation logged</p>
                </EmptyDetails>
              )}
              {/* </Box> */}
            </Col>
            <Col md="12" className="">
              {processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_RISK].status && (
                <Loading />
              )}
              {controlsOnVisitingRisk?.length > 0 &&
                controlsOnVisitingRisk.map((data) => (
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
                <Attachments s3Information={visitingRisk?.attachments}>
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
                    <AuditShortDetail audit={visitingRisk?.source?.module} />
                  </Col>
                </Row>
              </React.Fragment>
            )}
          </Row>

          <RiskOverview />
          <RiskStatus />
        </Box>

        <DrawerRight drawerId="edit-risk-form">
          {visitingRisk && (
            <RiskForm
              visitingRisk={visitingRisk}
              drawerView={true}
              onSubmit={async (formData) => {
                const mutationData = {
                  group: formData.group.value,
                  type: formData.type.value,
                  owner: formData.owner.value,
                  asset: formData.asset.value,
                  title: formData.title,
                  description: formData.description,
                  likelihood: parseInt(formData.likelihood.value),
                  consequence: parseInt(formData.consequence.value),
                  controlsAndMitigation: formData.controlsAndMitigation,
                  mitigationStatus: formData.mitigationStatus,
                  acceptanceRational: formData.acceptanceRational,
                  decisionMaker: formData.decisionMaker,
                  acceptanceStatus: formData.acceptanceStatus,
                  attachments: formData.attachments,
                  tagsAndCategories: formData.tagsAndCategories.value,
                };
                await updateRisk(mutationData);
                closeDrawer("edit-risk-form");
              }}
            />
          )}
        </DrawerRight>
      </Col>
    </div>
  );
};

export default RiskDescription;
