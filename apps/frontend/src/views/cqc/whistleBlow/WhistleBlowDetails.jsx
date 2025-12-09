import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import Loading from "@/components/Loader/Loading";
import { Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCqcWhistleBlow } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import WhistleblowActionsContextProvider from "./context/WhistleblowActionsContext";
import useWhistleBlow from "./hooks/useWhistleBlow";
import WhistleBlowForm from "./WhistleBlowForm";
import WhistleBlowOverview from "./WhistleBlowOverview";

const WhistleBlowDetails = (props) => {
  const { isModalOpen = false } = props;
  const { isClosedWhistleBlow } = useWhistleBlow();
  let { authUser } = useAccess();
  let [whistleBlow, setWhistleBlow] = useState(null);
  let [processing, setProcessing] = useState({
    action: "load-whistleblow",
    id: null,
  });

  const refreshWhistleBlow = (whistleBlow) => {
    setWhistleBlow(whistleBlow);
    props.onUpdate && props.onUpdate(whistleBlow);
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getCqcWhistleBlow(id);
        setWhistleBlow(data.whistleBlow);
        setProcessing({ action: null, id: null, error: false });
      } catch (ex) {
        setProcessing({ action: null, id: null, error: true });
        imsLogger("WhistleBlowDetails", ex, ex.response);
      }
    }
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <WhistleblowActionsContextProvider
        value={{ whistleBlow, setProcessing, processing, refreshWhistleBlow }}
      >
        <Panel panelId="Details">
          <ErrorHandlerComponent
            hasError={processing.error}
            errorMessage="This Complaint has been deleted or removed"
          >
            {processing.action === "load-whistleblow" ? (
              <Loading />
            ) : (
              whistleBlow && (
                <Row>
                  <Col xl="4" sm="12">
                    <DetailsSidebar
                      title="Details"
                      iconClass="ims-icons-20 icon-document-regular"
                      label={`Reported on ${moment(
                        whistleBlow?.created?.on
                      ).format("DD/MM/YYYY HH:mm")}`}
                    >
                      <WhistleBlowOverview data={whistleBlow} />
                    </DetailsSidebar>
                  </Col>
                  <Col xl="8" sm="12" className="mb-3">
                    <SwitchableView
                      viewTitle={whistleBlow.title}
                      canSwitch={
                        !isClosedWhistleBlow(whistleBlow) &&
                        authUser({
                          service: IMS_SERVICES.CQC,
                          action: ACTIONS.CREATE,
                          effect: EFFECTS.ALLOW,
                        })
                      }
                    >
                      <SecondaryWrapperChild>
                        <WhistleBlowForm
                          whistleBlow={whistleBlow}
                          refreshWhistleBlow={refreshWhistleBlow}
                          processing={processing}
                          setProcessing={setProcessing}
                        />
                      </SecondaryWrapperChild>
                      <PrimaryWrapperChild>
                        <div className="m-3">
                          <Row>
                            <Col md="12">
                              <DetailsSectionContent
                                label={"Place of incident: "}
                                value={whistleBlow.placeOfIncident}
                              />
                            </Col>
                            <Col md="12">
                              <DetailsSectionFormattedTextWrapper
                                label={"Description:"}
                              >
                                <FormattedContents
                                  value={whistleBlow.description}
                                  mediaLinkGeneratorFn={linkGenerator}
                                />
                              </DetailsSectionFormattedTextWrapper>
                            </Col>
                            <Col md="12">
                              <DetailsSectionContent
                                label={"Involved personnel: "}
                                value={whistleBlow.involvedPersonnel.map(
                                  (person) => person?.name
                                )}
                              />
                            </Col>
                            <Col md="12">
                              <DetailsSectionContent
                                label={"Shared with: "}
                                value={whistleBlow.sharedWith.map(
                                  (person) => person?.name
                                )}
                              />
                            </Col>
                            <Col md="12 mb-2">
                              <DetailsSectionFormattedTextWrapper
                                label={"Opinion:"}
                              >
                                <FormattedContents
                                  value={whistleBlow.opinion}
                                  mediaLinkGeneratorFn={linkGenerator}
                                />
                              </DetailsSectionFormattedTextWrapper>
                            </Col>
                            <Col md="12">
                              <DetailsSectionContent
                                label="Reporter's intention for disclosure:"
                                value={
                                  (whistleBlow.statementOfDisclosureOne
                                    .status &&
                                    whistleBlow.statementOfDisclosureOne
                                      .value) ||
                                  (whistleBlow.statementOfDisclosureTwo
                                    .status &&
                                    whistleBlow.statementOfDisclosureTwo
                                      .value) ||
                                  (whistleBlow.statementOfDisclosureThree
                                    .status &&
                                    whistleBlow.statementOfDisclosureThree
                                      .value)
                                }
                              ></DetailsSectionContent>
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
      </WhistleblowActionsContextProvider>
    </React.Fragment>
  );
};

export default WhistleBlowDetails;
