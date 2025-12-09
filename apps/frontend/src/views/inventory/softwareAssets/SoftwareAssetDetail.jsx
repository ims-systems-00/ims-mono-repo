import React from "react";
// @ims-systems-00/ims-ui-kit components
import Loading from "@/components/Loader/Loading";
import { Panels, Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import moment from "moment";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getSoftwareAsset } from "@/services/inventoryServices";
import { imsLogger } from "@/services/loggerService";
import { getCurrentUserInfo } from "@/services/userServices";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import SoftwareActionsContextProvider from "./context/SoftwareActionsContext";
import DocumentsButtons from "./Documents";
import SoftwareAssetForm from "./SoftwareAssetForm";
import SoftwareKeyForm from "./SoftwareKeyForm";
import SoftwareKeys from "./SoftwareKeys";
import SoftwareOverview from "./SoftwareOverview";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";

const SoftwareAssetDetail = (props) => {
  const { isModalOpen = false } = props;
  const currentUser = getCurrentUserInfo();
  let { authUser } = useAccess(currentUser);
  let [software, setSoftware] = React.useState(null);
  let [processing, setProcessing] = React.useState({
    action: "load-software",
    id: null,
    error: false,
  });
  let refreshSoftwareAsset = (software) => {
    setSoftware(software);
    props.onUpdate && props.onUpdate(software);
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getSoftwareAsset(id);
        setSoftware(data.softwareAsset);
        setProcessing({ action: null, id: null, error: false });
      } catch (ex) {
        setProcessing({ action: null, id: null, error: true });
        imsLogger("SoftwareAssetDetail", ex, ex.response);
      }
    }
    fetchData();
  }, []);
  return (
    <React.Fragment>
      <div className="content">
        <SoftwareActionsContextProvider
          value={{
            setProcessing,
            processing,
            software,
            refreshSoftwareAsset,
          }}
        >
          <Panels
            defaultPanel={"Details"}
            navLinks={isModalOpen ? [] : ["Details"]}
            backLinks={
              props.match && [
                {
                  linkText: "Back",
                  link: props.match.path.split("/:")[0],
                },
              ]
            }
          >
            <Panel panelId="Details">
              <ErrorHandlerComponent
                hasError={processing.error}
                errorMessage="This software asset has been deleted or removed"
              >
                {processing.action === "load-software" ? (
                  <Loading />
                ) : (
                  software && (
                    <Row>
                      <Col xl="4" sm="12">
                        <DetailsSidebar
                          title="Details"
                          iconClass="ims-icons-20 icon-document-regular"
                          label={`Raised on ${moment(
                            software?.created?.on
                          ).format("DD/MM/YYYY")}`}
                        >
                          <SoftwareOverview data={software} />
                        </DetailsSidebar>
                      </Col>
                      <Col xl="8" sm="12" className="mb-3">
                        <SwitchableView
                          viewTitle={software.name}
                          canSwitchView={authUser({
                            service: IMS_SERVICES.INVENTORY,
                            action: ACTIONS.CREATE,
                            effect: EFFECTS.ALLOW,
                          })}
                        >
                          <SecondaryWrapperChild>
                            <SoftwareAssetForm
                              software={software}
                              processing={processing}
                              setProcessing={setProcessing}
                              refreshSoftwareAsset={refreshSoftwareAsset}
                            />
                            <SoftwareKeyForm />
                            <Row className="mt-3">
                              <Col md="12">
                                {software.keys.length
                                  ? software.keys.map((softwareKey) => (
                                      <SoftwareKeys
                                        key={softwareKey._id}
                                        softwareKey={softwareKey}
                                        canDelete={authUser({
                                          service: IMS_SERVICES.INVENTORY,
                                          action: ACTIONS.CREATE,
                                          effect: EFFECTS.ALLOW,
                                        })}
                                      />
                                    ))
                                  : "None"}
                              </Col>
                            </Row>
                          </SecondaryWrapperChild>
                          <PrimaryWrapperChild>
                            <DetailsWrapper label={`Keys`} />
                            <Row>
                              <Col md="12">
                                {software.keys.length
                                  ? software.keys.map((softwareKey) => (
                                      <SoftwareKeys
                                        key={softwareKey._id}
                                        softwareKey={softwareKey}
                                        canDelete={authUser({
                                          service: IMS_SERVICES.INVENTORY,
                                          action: ACTIONS.CREATE,
                                          effect: EFFECTS.ALLOW,
                                        })}
                                      />
                                    ))
                                  : "None"}
                              </Col>
                              {software?.tagsAndCategories && (
                                <Col md="12">
                                  <DetailsWrapper
                                    label={"Additional Information:"}
                                    iconClass={"tim-icons icon-pencil"}
                                    value={`Category: ${software?.tagsAndCategories?.name}`}
                                    labelClass={"pr-2"}
                                  />
                                </Col>
                              )}
                            </Row>
                            <br></br>
                            <DetailsSectionHeader title={`Attachments`} />
                            <Row>
                              <Col md="12">
                                <Attachments s3Information={software?.docs}>
                                  <DocumentsButtons />
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
          </Panels>
        </SoftwareActionsContextProvider>
      </div>
    </React.Fragment>
  );
};
export default SoftwareAssetDetail;
