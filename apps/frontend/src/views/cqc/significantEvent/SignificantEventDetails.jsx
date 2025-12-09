import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import Loading from "@/components/Loader/Loading";
import { Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import TimeLine from "@/views/shared/Timeline/Timeline";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getSignificantEvent } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import SignificantEventActionsContextProvider from "./context/SignificantEventActionsContext";
import SignificantEventAttachments from "./SignificantEventAttachments";
import SignificantEventForm from "./SignificantEventForm";
import SignificantEventOverview from "./SignificantEventOverview";

const SignificantEventDetails = (props) => {
  const { isModalOpen = false } = props;
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);
  let [significantEvent, setSignificantEvent] = React.useState(null);
  let [processing, setProcessing] = useState({
    action: "load-event",
    id: null,
    error: false,
  });
  const refreshSignificantEvent = (significantEvent) => {
    setSignificantEvent(significantEvent);
    props.onUpdate && props.onUpdate(significantEvent);
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getSignificantEvent(id);
        setSignificantEvent(data.significantEvent);
        setProcessing({ action: null, id: null, error: false });
      } catch (ex) {
        setProcessing({ action: null, id: null, error: true });
        imsLogger("SignificantEventDetails", ex, ex.response);
      }
    }
    fetchData();
  }, []);

  const getPermissionStatus = (significantEvent) => {
    return significantEvent.signed.status;
  };
  imsLogger(significantEvent, "SignificantEventDetails");

  return (
    <React.Fragment>
      <div className="content">
        <SignificantEventActionsContextProvider
          value={{
            significantEvent,
            setProcessing,
            processing,
            refreshSignificantEvent,
          }}
        >
          <Panel panelId="Details">
            <ErrorHandlerComponent
              hasError={processing.error}
              errorMessage="This event has been deleted or removed"
            >
              {" "}
              {processing.action === "load-event" ? (
                <Loading />
              ) : (
                significantEvent && (
                  <>
                    <Row>
                      <Col xl="4" sm="12">
                        <DetailsSidebar
                          title="Details"
                          iconClass="ims-icons-20 icon-document-regular"
                          label={`Raised on ${moment(
                            significantEvent?.created?.on
                          ).format("DD/MM/YYYY")}`}
                        >
                          <SignificantEventOverview data={significantEvent} />
                        </DetailsSidebar>
                      </Col>
                      <Col xl="8" sm="12" className="mb-3">
                        <SwitchableView
                          viewTitle={significantEvent.title}
                          canSwitch={
                            authUser({
                              service: IMS_SERVICES.CQC,
                              action: ACTIONS.CREATE,
                              effect: EFFECTS.ALLOW,
                            }) && !getPermissionStatus(significantEvent)
                          }
                        >
                          <SecondaryWrapperChild>
                            <SignificantEventForm
                              significantEvent={significantEvent}
                              refreshSignificantEvent={refreshSignificantEvent}
                              processing={processing}
                              setProcessing={setProcessing}
                            />
                          </SecondaryWrapperChild>
                          <PrimaryWrapperChild>
                            <Row>
                              <Col md="12 mb-2">
                                <DetailsSectionFormattedTextWrapper
                                  label={"Description:"}
                                >
                                  <FormattedContents
                                    value={significantEvent.description}
                                    mediaLinkGeneratorFn={linkGenerator}
                                  />
                                </DetailsSectionFormattedTextWrapper>
                              </Col>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Present personnel: "}
                                  value={significantEvent.presentPersonnel}
                                />
                              </Col>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Key issues: "}
                                  value={significantEvent.keyIssues}
                                />
                              </Col>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Positive points: "}
                                  value={significantEvent.positivePoints}
                                />
                              </Col>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Areas of concern: "}
                                  value={significantEvent.areasOfConcern}
                                />
                              </Col>
                            </Row>
                            <DetailsSectionHeader title={`Attachments`} />
                            <Row>
                              <Col md="12">
                                <Attachments
                                  s3Information={significantEvent?.attachments}
                                >
                                  <SignificantEventAttachments />
                                </Attachments>
                              </Col>
                            </Row>
                            <DetailsSectionHeader title={`Actions`} />
                            <Row>
                              <Col md="12" className="mb-4">
                                {!getPermissionStatus(significantEvent) ? (
                                  <TimeLine
                                    editLabel="comment"
                                    editPlaceholder="Comment"
                                    horizontalSpacing={true}
                                    containerClass="mx-auto sm-10"
                                    moduleType="cqcsignificantevents"
                                    moduleId={significantEvent._id}
                                  />
                                ) : (
                                  <TimeLine
                                    readOnly={true}
                                    horizontalSpacing={false}
                                    containerClass="mx-auto sm-10"
                                    moduleType="cqcsignificantevents"
                                    moduleId={significantEvent._id}
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
          </Panel>
        </SignificantEventActionsContextProvider>
      </div>
    </React.Fragment>
  );
};

export default SignificantEventDetails;
