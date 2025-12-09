import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useState } from "react";
import { getControl } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import TimeLine from "@/views/shared/Timeline/Timeline";
import DetailsSidebar from "../../shared/DetailComponents/DetailsSidebar";
import ToolActionsContextProvider from "./context/ToolActionsContext";
import ToolAttachments from "./ToolAttachments";
import ToolControlform from "./ToolControlform";
import ToolControlOverview from "./ToolControlOverview";
import ToolEvidences from "./ToolEvidences";

const ToolControlDetails = (props) => {
  const { isModalOpen = false } = props;
  let { authUser } = useAccess();
  let [toolControl, setToolControl] = useState(null);
  let [processing, setProcessing] = useState({
    action: "load-control",
    id: null,
    error: false,
  });
  const refreshControl = (toolControl) => {
    setToolControl(toolControl);
    props.onUpdate && props.onUpdate(toolControl);
  };
  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getControl(id);
        setToolControl(data.tool);
        setProcessing({ action: null, id: null, error: false });
      } catch (ex) {
        setProcessing({ action: null, id: null, error: true });
        imsLogger("CQCSitesToolControlDetail", ex, ex.response);
      }
    }
    fetchData();
  }, []);
  return (
    <React.Fragment>
      <div className="content">
        <ToolActionsContextProvider
          value={{ toolControl, setProcessing, processing, refreshControl }}
        >
          <Panels
            isModalOpen={isModalOpen}
            backLinks={
              props.match && [
                {
                  linkText: "Back",
                  link: props.match.path.split("/:")[0],
                },
              ]
            }
            defaultPanel={"Details"}
          >
            <Panel panelId="Details">
              <ErrorHandlerComponent
                hasError={processing.error}
                errorMessage="This Tool has been deleted or removed"
              >
                {processing.action === "load-control" ? (
                  <Loading />
                ) : (
                  toolControl && (
                    <>
                      <Row>
                        <Col xl="4" sm="12">
                          <DetailsSidebar
                            title="Details"
                            iconClass="ims-icons-20 icon-document-regular"
                            label={`Raised on ${moment(
                              toolControl?.created?.on
                            ).format("DD/MM/YYYY")}`}
                          >
                            <ToolControlOverview data={toolControl} />
                          </DetailsSidebar>
                        </Col>
                        <Col xl="8" sm="12" className="mb-3">
                          <SwitchableView>
                            <SecondaryWrapperChild>
                              {processing.action === "load-control" ? (
                                <Loading />
                              ) : (
                                toolControl && (
                                  <div>
                                    <ToolControlform
                                      toolControl={toolControl}
                                      processing={processing}
                                      setProcessing={setProcessing}
                                      refreshControl={refreshControl}
                                    />
                                    <ToolAttachments
                                      toolControl={toolControl}
                                    />
                                    <Row>
                                      <Col>
                                        <span className="text-primary text-center mt-3  font-size-subtitle-1">
                                          Comments
                                        </span>
                                      </Col>
                                    </Row>
                                    <TimeLine
                                      editLabel="comment"
                                      editPlaceholder="Comment"
                                      horizontalSpacing={true}
                                      containerClass="mx-auto sm-10"
                                      moduleType="cqcdetails"
                                      moduleId={toolControl._id}
                                    />
                                  </div>
                                )
                              )}
                            </SecondaryWrapperChild>
                            <PrimaryWrapperChild>
                              <DetailsSectionHeader title={`Clause details`} />
                              <Row>
                                <Col md="12">
                                  <DetailsWrapper
                                    label={"KLOE-Prompt: "}
                                    value={toolControl.control.kloe}
                                  />
                                </Col>
                              </Row>
                              <DetailsSectionHeader title={`Evidences`} />
                              <Row>
                                <Col md="12">
                                  <Attachments
                                    s3Information={toolControl.evidences}
                                  >
                                    <ToolEvidences />
                                  </Attachments>
                                </Col>
                              </Row>
                              <DetailsSectionHeader title={`Comments`} />
                              <Row>
                                <Col md="12" className="mb-4">
                                  <TimeLine
                                    readOnly={true}
                                    horizontalSpacing={false}
                                    containerClass="mx-auto sm-10"
                                    moduleType="cqcdetails"
                                    moduleId={toolControl._id}
                                  />
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
          </Panels>
        </ToolActionsContextProvider>
      </div>
    </React.Fragment>
  );
};

export default ToolControlDetails;
