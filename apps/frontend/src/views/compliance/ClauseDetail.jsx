import SafeHtml from "@/components/HtmlParser/SafeHtml";
import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import TimeLine from "@/views/shared/Timeline/Timeline";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getComplianceControl } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import ClauseAttachments from "./ClauseAttachments";
import ClauseEvidences from "./ClauseEvidences";
import ClauseOverview from "./ClauseOverview";
import ClauseUpdateForm from "./ClauseUpdateForm";
import ComplianceActionsContextProvider from "./contexts/ComplianceActionsContext";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";

let writeAccessPolicies = [
  {
    service: IMS_SERVICES.ISO27001,
    action: ACTIONS.CREATE,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO27002,
    action: ACTIONS.CREATE,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO20000,
    action: ACTIONS.CREATE,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO14001,
    action: ACTIONS.CREATE,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO45001,
    action: ACTIONS.CREATE,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO9001,
    action: ACTIONS.CREATE,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.DSPTNHS,
    action: ACTIONS.CREATE,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.BS9997,
    action: ACTIONS.CREATE,
    effect: EFFECTS.ALLOW,
  },
];

let readAccessPolicies = [
  {
    service: IMS_SERVICES.ISO27001,
    action: ACTIONS.READ,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO27002,
    action: ACTIONS.READ,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO20000,
    action: ACTIONS.READ,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO14001,
    action: ACTIONS.READ,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO45001,
    action: ACTIONS.READ,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.ISO9001,
    action: ACTIONS.READ,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.DSPTNHS,
    action: ACTIONS.READ,
    effect: EFFECTS.ALLOW,
  },
  {
    service: IMS_SERVICES.BS9997,
    action: ACTIONS.READ,
    effect: EFFECTS.ALLOW,
  },
];

const ClauseDetail = (props) => {
  let { authUser } = useAccess();
  let [clauseTool, setClauseTool] = useState(null);
  let [processing, setProcessing] = useState({
    action: "load-clause",
    id: null,
    error: false,
  });
  const refreshClause = (clauseTool) => {
    setClauseTool(clauseTool);
    props.onUpdate && props.onUpdate(clauseTool);
  };
  React.useEffect(() => {
    async function fetchData() {
      try {
        setProcessing({ action: "load-clause", id: null, error: false });
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getComplianceControl(id);
        setClauseTool(data.control);
        setProcessing({ action: null, id: null, error: false });
      } catch (ex) {
        setProcessing({ action: null, id: null, error: true });
        imsLogger("ClauseDetail", ex, ex.response);
      }
    }
    fetchData();
  }, []);

  // const authAmendTab = () =>
  //   authUser(writeAccessPolicies) && clauseTool && !clauseTool.control.isLocked
  //     ? ["Control"]
  //     : [];

  const authAnnexTab = () =>
    authUser(readAccessPolicies) && clauseTool && clauseTool.control.annex;

  return (
    <>
      <div className="content">
        <ComplianceActionsContextProvider
          value={{ clauseTool, setProcessing, processing, refreshClause }}
        >
          <NavigationTabs
            activeTab="details"
            navigations={[
              {
                id: "details",
                text: "Details",
                icon: (
                  <i className="ims-icons-20 icon-icon-document-24 me-1"></i>
                ),
                component: (
                  <ErrorHandlerComponent
                    hasError={processing.error}
                    errorMessage="This Tool has been deleted or removed"
                  >
                    {processing.action === "load-clause" ? (
                      <Loading />
                    ) : (
                      clauseTool && (
                        <>
                          <Row>
                            <Col xl="4" sm="12">
                              <DetailsSidebar
                                title="Details"
                                iconClass="ims-icons-20 icon-document-regular"
                                label={`Updated on ${moment(
                                  clauseTool?.updated?.on
                                ).format("DD/MM/YYYY HH:mm")}`}
                              >
                                <ClauseOverview data={clauseTool} />
                              </DetailsSidebar>
                            </Col>
                            <Col xl="8" sm="12" className="mb-3">
                              <SwitchableView
                                viewTitle={clauseTool.control.title}
                                canSwitch={
                                  authUser(writeAccessPolicies) &&
                                  clauseTool &&
                                  !clauseTool.control.isLocked
                                }
                              >
                                <SecondaryWrapperChild>
                                  <ErrorHandlerComponent
                                    hasError={processing.error}
                                    errorMessage="This clause has been deleted or removed"
                                  >
                                    {processing.action === "load-clause" ? (
                                      <Loading />
                                    ) : (
                                      clauseTool && (
                                        <>
                                          <ClauseUpdateForm
                                            clauseTool={clauseTool}
                                            processing={processing}
                                            setProcessing={setProcessing}
                                            refreshClause={refreshClause}
                                          />
                                          <ClauseAttachments
                                            clauseTool={clauseTool}
                                          />
                                        </>
                                      )
                                    )}
                                  </ErrorHandlerComponent>
                                </SecondaryWrapperChild>
                                <PrimaryWrapperChild>
                                  <div className="m-3">
                                    <Row>
                                      {clauseTool.control.description && (
                                        <Col md="12">
                                          <DetailsSectionContent
                                            label={"Description: "}
                                            value={
                                              <SafeHtml
                                                html={
                                                  clauseTool.control.description ||
                                                  ""
                                                }
                                              />
                                            }
                                          />
                                        </Col>
                                      )}
                                      {clauseTool?.control?.moreInfo?.note && (
                                        <Col md="12">
                                          <br></br>
                                          <DetailsSectionContent
                                            label={"Note: "}
                                            value={
                                              <SafeHtml
                                                html={
                                                  clauseTool?.control?.moreInfo
                                                    ?.note || ""
                                                }
                                              />
                                            }
                                          />
                                        </Col>
                                      )}
                                    </Row>
                                    {clauseTool.evidences &&
                                      clauseTool.evidences.length > 0 && (
                                        <>
                                          <br></br>
                                          <DetailsSectionHeader
                                            title={`Evidences:`}
                                          />
                                          <Row>
                                            <Col md="12" className="mb-4">
                                              <Attachments
                                                s3Information={
                                                  clauseTool?.evidences
                                                }
                                              >
                                                <ClauseEvidences />
                                              </Attachments>
                                            </Col>
                                          </Row>
                                        </>
                                      )}

                                    <DetailsSectionHeader title="Comments (State evidences against this clause)" />
                                    <Row>
                                      <Col md="12">
                                        <TimeLine
                                          editLabel="comment"
                                          editPlaceholder="Comment"
                                          horizontalSpacing={true}
                                          containerClass="mx-auto sm-10"
                                          moduleType="controlstatuses"
                                          moduleId={clauseTool._id}
                                        />
                                      </Col>
                                    </Row>
                                  </div>
                                </PrimaryWrapperChild>
                              </SwitchableView>
                            </Col>
                          </Row>
                        </>
                      )
                    )}
                  </ErrorHandlerComponent>
                ),
              },
              ...(authAnnexTab()
                ? [
                    {
                      id: "annex",
                      text: "Annex",
                      icon: (
                        <i className="ims-icons-20 icon-icon-document-24 me-1"></i>
                      ),
                      component: (
                        <ErrorHandlerComponent
                          hasError={processing.error}
                          errorMessage="This Tool has been deleted or removed"
                        >
                          {" "}
                          {clauseTool && (
                            <Row>
                              <Col md="10" className="mx-auto">
                                <SafeHtml html={clauseTool.control.annex} />
                              </Col>
                            </Row>
                          )}
                        </ErrorHandlerComponent>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </ComplianceActionsContextProvider>
      </div>
    </>
  );
};

export default ClauseDetail;
