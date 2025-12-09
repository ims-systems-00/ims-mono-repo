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
import { getSafeguarding } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import SignificantEventActionsContextProvider from "../significantEvent/context/SignificantEventActionsContext";
import SafeguardingForm from "./SafeguardingFrom";
import SafeguardingsAttachments from "./SafeguardingsAttachments";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import SafeguardingOverview from "./SafeguardingOverview";

const Safeguarding = (props) => {
  const { isModalOpen = false } = props;
  let [safeguarding, setSafeguarding] = useState(null);
  let [processing, setProcessing] = useState({
    action: "load-safeguarding",
    id: null,
    error: false,
  });
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);
  let refreshSafeguarding = (safeguarding) => {
    setSafeguarding(safeguarding);
    props.onUpdate && props.onUpdate(safeguarding);
  };
  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getSafeguarding(id);
        setSafeguarding(data.safeGuarding);
        setProcessing({ action: null, id: null, error: false });
      } catch (ex) {
        setProcessing({ action: null, id: null, error: true });
        imsLogger("safeGuarding", ex, ex.response);
      }
    }
    fetchData();
  }, []);

  const isCloseSafeguarding = (safeguarding) => {
    return safeguarding.signed.status;
  };

  return (
    <React.Fragment>
      <div className="content">
        <SignificantEventActionsContextProvider
          value={{
            safeguarding,
            setProcessing,
            processing,
            refreshSafeguarding,
          }}
        >
          <Panel panelId="Details">
            <ErrorHandlerComponent
              hasError={processing.error}
              errorMessage="This report has been deleted or removed"
            >
              {processing.action === "load-safeguarding" ? (
                <Loading />
              ) : (
                safeguarding && (
                  <Row>
                    <Col xl="4" sm="12">
                      <DetailsSidebar
                        title="Details"
                        iconClass="ims-icons-20 icon-document-regular"
                        label={`Raised on ${moment(
                          safeguarding?.created?.on
                        ).format("DD/MM/YYYY")}`}
                      >
                        <SafeguardingOverview data={safeguarding} />
                      </DetailsSidebar>
                    </Col>
                    <Col xl="8" sm="12" className="mb-3">
                      <SwitchableView
                        viewTitle={safeguarding?.personAffected}
                        canSwitch={
                          authUser({
                            service: IMS_SERVICES.CQC,
                            action: ACTIONS.CREATE,
                            effect: EFFECTS.ALLOW,
                          }) && !isCloseSafeguarding(safeguarding)
                        }
                      >
                        <SecondaryWrapperChild>
                          <SafeguardingForm
                            refreshSafeguarding={refreshSafeguarding}
                            processing={processing}
                            safeguarding={safeguarding}
                            setProcessing={setProcessing}
                          />
                        </SecondaryWrapperChild>
                        <PrimaryWrapperChild>
                          <Row>
                            <Col md="12 mb-2">
                              <DetailsSectionFormattedTextWrapper
                                label={"Investigation:"}
                              >
                                {!safeguarding?.investigation !== "" && (
                                  <FormattedContents
                                    value={safeguarding.investigation}
                                    mediaLinkGeneratorFn={linkGenerator}
                                  />
                                )}
                              </DetailsSectionFormattedTextWrapper>
                            </Col>
                            <Col md="12 mb-2">
                              <DetailsSectionFormattedTextWrapper
                                label={"Outcome:"}
                              >
                                {!safeguarding?.outcome !== "" && (
                                  <FormattedContents
                                    value={safeguarding.outcome}
                                    mediaLinkGeneratorFn={linkGenerator}
                                  />
                                )}
                              </DetailsSectionFormattedTextWrapper>
                            </Col>
                            <Col md="12 mb-2">
                              <DetailsSectionFormattedTextWrapper
                                label={"Summary of concerns:"}
                              >
                                <FormattedContents
                                  value={safeguarding.summaryOfConcerns}
                                  mediaLinkGeneratorFn={linkGenerator}
                                />
                              </DetailsSectionFormattedTextWrapper>
                            </Col>
                            {safeguarding.referred.status && (
                              <>
                                <Col md="12">
                                  <DetailsSectionContent
                                    label={"Shared with: "}
                                    value={safeguarding.sharedWith.map(
                                      (person) => person?.name
                                    )}
                                  />
                                </Col>
                                <Col md="12">
                                  <DetailsSectionContent
                                    label={"Referred to: "}
                                    value={safeguarding?.referred?.to}
                                  />
                                </Col>
                                <Col md="12">
                                  <DetailsSectionContent
                                    label={"Rational: "}
                                    value={safeguarding?.referred?.rational}
                                  />
                                </Col>
                                <Col md="12">
                                  <DetailsSectionContent
                                    label={"Name of organisation: "}
                                    value={
                                      safeguarding?.referred?.nameOfOrganisation
                                    }
                                  />
                                </Col>
                              </>
                            )}
                          </Row>
                          <DetailsSectionHeader title={`Attachments`} />
                          <Row>
                            <Col md="12" className="mb-4">
                              <Attachments
                                s3Information={safeguarding.attachments}
                              >
                                <SafeguardingsAttachments />
                              </Attachments>
                            </Col>
                          </Row>
                        </PrimaryWrapperChild>
                      </SwitchableView>
                    </Col>
                  </Row>
                )
              )}
            </ErrorHandlerComponent>
          </Panel>
        </SignificantEventActionsContextProvider>
      </div>
    </React.Fragment>
  );
};

export default Safeguarding;
