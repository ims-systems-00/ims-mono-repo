import Loading from "@/components/Loader/Loading";
import { Panels, Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getHardwareAsset } from "@/services/inventoryServices";
import { imsLogger } from "@/services/loggerService";
import { getCurrentUserInfo } from "@/services/userServices";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import HardwareOverview from "./HardwareOverview";
import HardwareAssetForm from "./HarwareAssetForm";

const HardwareAssetDetail = (props) => {
  const { isModalOpen = false } = props;
  const currentUser = getCurrentUserInfo();
  let { authUser } = useAccess(currentUser);
  let notify = React.useContext(NotificationContext);
  let [hardware, setHardware] = React.useState(null);
  let [processing, setProcessing] = useState({
    action: "load-hardware",
    id: null,
    error: false,
  });

  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getHardwareAsset(id);
        setHardware(data.hardwareAsset);
        setProcessing({ action: null, id: null, error: false });
      } catch (ex) {
        setProcessing({ action: null, id: null, error: true });
        imsLogger("HardwareAssetDetail", ex, ex.response);
      }
    }
    fetchData();
  }, []);
  return (
    <React.Fragment>
      <div className="content">
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
              errorMessage="This hardware asset has been deleted or removed"
            >
              {processing.action === "load-hardware" ? (
                <Loading />
              ) : (
                hardware && (
                  <>
                    <Row>
                      <Col xl="4" sm="12">
                        <DetailsSidebar
                          title="Details"
                          iconClass="ims-icons-20 icon-document-regular"
                          label={`Raised on ${moment(
                            hardware?.created?.on
                          ).format("DD/MM/YYYY")}`}
                        >
                          <HardwareOverview data={hardware} />
                        </DetailsSidebar>
                      </Col>
                      <Col xl="8" sm="12" className="mb-3">
                        <SwitchableView
                          viewTitle={hardware.name}
                          canSwitch={authUser({
                            service: IMS_SERVICES.INVENTORY,
                            action: ACTIONS.CREATE,
                            effect: EFFECTS.ALLOW,
                          })}
                        >
                          <SecondaryWrapperChild>
                            <HardwareAssetForm
                              hardware={hardware}
                              processing={processing}
                              setProcessing={setProcessing}
                            />
                          </SecondaryWrapperChild>
                          <PrimaryWrapperChild>
                            <DetailsWrapper label={`Asset lifecycle`} />
                            <Row>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Assigned date:"}
                                  value={
                                    hardware.assignedDate
                                      ? moment(hardware.assignedDate).format(
                                          "DD/MM/YYYY"
                                        )
                                      : ""
                                  }
                                />
                              </Col>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Returned date:"}
                                  value={
                                    hardware.returnDate
                                      ? moment(hardware.returnDate).format(
                                          "DD/MM/YYYY"
                                        )
                                      : ""
                                  }
                                />
                              </Col>
                              <Col md="12">
                                <DetailsSectionContent
                                  label={"Destruction date:"}
                                  value={
                                    hardware.destructionDate
                                      ? moment(hardware.destructionDate).format(
                                          "DD/MM/YYYY"
                                        )
                                      : ""
                                  }
                                />
                              </Col>
                              {hardware?.tagsAndCategories && (
                                <Col md="12" className="mx-2">
                                  <DetailsWrapper
                                    label={"Additional Information:"}
                                    iconClass={"tim-icons icon-pencil"}
                                    value={`Category: ${hardware?.tagsAndCategories?.name}`}
                                    labelClass={"pr-2"}
                                  />
                                </Col>
                              )}
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
      </div>
    </React.Fragment>
  );
};
export default HardwareAssetDetail;
