import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import Loading from "@/components/Loader/Loading";
import { Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getComplaint } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import ComplaintAttachmentsButton from "./ComplaintAttachmentsButton";
import Complaintform from "./Complaintform";
import ComplaintOverview from "./ComplaintOverview";
import ComplaintActionsContextProvider from "./context/CompalintActionsContext";

const ComplaintDetails = (props) => {
  const { isModalOpen = false } = props;
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);
  let [complaint, setComplaint] = React.useState(null);
  let [processing, setProcessing] = useState({
    action: "load-complaint",
    id: null,
    error: false,
  });
  const refreshComplaint = (complaint) => {
    setComplaint(complaint);
    props.onUpdate && props.onUpdate(complaint);
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getComplaint(id);
        setComplaint(data.compliant);
        setProcessing({ action: null, id: null, error: false });
      } catch (ex) {
        setProcessing({ action: null, id: null, error: true });
        imsLogger("ComplaintDetail", ex, ex.response);
      }
    }
    fetchData();
  }, []);

  const getSubmissionStatus = (complaint) => {
    return complaint.signed.status;
  };
  return (
    <React.Fragment>
      <div className="content">
        <ComplaintActionsContextProvider
          value={{ complaint, setProcessing, processing, refreshComplaint }}
        >
          <Panel panelId="Details">
            <ErrorHandlerComponent
              hasError={processing.error}
              errorMessage="This Complaint has been deleted or removed"
            >
              {processing.action === "load-complaint" ? (
                <Loading />
              ) : (
                complaint && (
                  <Row>
                    <Col xl="4" sm="12">
                      <DetailsSidebar
                        title="Details"
                        iconClass="ims-icons-20 icon-document-regular"
                        label={`Raised on ${moment(
                          complaint?.created?.on
                        ).format("DD/MM/YYYY HH:mm")}`}
                      >
                        <ComplaintOverview data={complaint} />
                      </DetailsSidebar>
                    </Col>
                    <Col xl="8" sm="12" className="mb-3">
                      <SwitchableView
                        viewTitle={complaint.name}
                        canSwitch={
                          authUser({
                            service: IMS_SERVICES.CQC,
                            action: ACTIONS.CREATE,
                            effect: EFFECTS.ALLOW,
                          }) && !getSubmissionStatus(complaint)
                        }
                      >
                        <SecondaryWrapperChild>
                          <Complaintform
                            complaint={complaint}
                            refreshComplaint={refreshComplaint}
                            processing={processing}
                            setProcessing={setProcessing}
                          />
                        </SecondaryWrapperChild>
                        <PrimaryWrapperChild>
                          <div className="m-3">
                            <Row>
                              <Col md="12" className="mb-2">
                                <DetailsSectionFormattedTextWrapper
                                  label={"Details:"}
                                >
                                  <FormattedContents
                                    value={complaint.detail}
                                    mediaLinkGeneratorFn={linkGenerator}
                                  />
                                </DetailsSectionFormattedTextWrapper>
                              </Col>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Preferred communication method: "}
                                  value={complaint.preferredCommunicationMethod}
                                />
                              </Col>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Type of service: "}
                                  value={complaint.typeOfService}
                                />
                              </Col>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Name of employee: "}
                                  value={complaint.nameOfEmployee}
                                />
                              </Col>
                              {complaint.nameOfOrganisation && (
                                <Col md="12">
                                  <DetailsSectionContent
                                    label={"Name of organisation: "}
                                    value={complaint.nameOfOrganisation}
                                  />
                                </Col>
                              )}
                              {complaint.investigation && (
                                <Col md="12" className="mb-2">
                                  <DetailsSectionFormattedTextWrapper
                                    label={"Investigation:"}
                                  >
                                    <FormattedContents
                                      value={complaint?.investigation}
                                      mediaLinkGeneratorFn={linkGenerator}
                                    />
                                  </DetailsSectionFormattedTextWrapper>
                                </Col>
                              )}
                              {complaint.outcome && (
                                <Col md="12" className="mb-2">
                                  <DetailsSectionFormattedTextWrapper
                                    label={"Investigated outcome:"}
                                  >
                                    <FormattedContents
                                      value={complaint.outcome}
                                      mediaLinkGeneratorFn={linkGenerator}
                                    />
                                  </DetailsSectionFormattedTextWrapper>
                                </Col>
                              )}
                              {complaint.actions && (
                                <Col md="12" className="mb-2">
                                  <DetailsSectionFormattedTextWrapper
                                    label={"Actions:"}
                                  >
                                    <FormattedContents
                                      value={complaint.actions}
                                      mediaLinkGeneratorFn={linkGenerator}
                                    />
                                  </DetailsSectionFormattedTextWrapper>
                                </Col>
                              )}
                              {complaint.referredActions && (
                                <Col md="12">
                                  <DetailsSectionContent
                                    label={"Referral actions: "}
                                    value={complaint.referredActions}
                                  />
                                </Col>
                              )}
                              {complaint.referredOutcome && (
                                <Col md="12">
                                  <DetailsSectionContent
                                    label={"Referral outcome: "}
                                    value={complaint.referredOutcome}
                                  />
                                </Col>
                              )}
                            </Row>
                            <DetailsSectionHeader title={`Attachments`} />
                            <Row>
                              <Col md="12" className="mb-4">
                                <Attachments
                                  s3Information={complaint.attachments}
                                >
                                  <ComplaintAttachmentsButton />
                                </Attachments>
                              </Col>
                            </Row>
                          </div>
                        </PrimaryWrapperChild>
                      </SwitchableView>
                    </Col>
                  </Row>
                )
              )}
            </ErrorHandlerComponent>
          </Panel>
        </ComplaintActionsContextProvider>
      </div>
    </React.Fragment>
  );
};

export default ComplaintDetails;
