import Loading from "@/components/Loader/Loading";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentUserInfo } from "@/services/userServices";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import HardwareOverview from "../HardwareOverview";
import HardwareAssetForm from "../HardwareAssetForm";
import { useHardwareAssets } from "../store";
import USER_ACTIONS from "../actions";
import HardwareAssetFormContainer from "./HardwareAssetFormContainer";

const HardwareAssetDetail = (props) => {
  const { hardware, processing } = useHardwareAssets();
  const currentUser = getCurrentUserInfo();
  let { authUser } = useAccess(currentUser);

  return (
    <div className="content">
      <h4 className="mb-3 text-primary fw-bold">Hardware asset details</h4>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_HARDWARE].error}
        errorMessage="This hardware asset has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_HARDWARE].status ? (
          <Loading />
        ) : (
          hardware && (
            <>
              <Row>
                <Col xl="4" sm="12">
                  <DetailsSidebar
                    title="Details"
                    iconClass="ims-icons-20 icon-document-regular"
                    label={`Raised on ${moment(hardware?.created?.on).format(
                      "DD/MM/YYYY"
                    )}`}
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
                      <HardwareAssetFormContainer />
                    </SecondaryWrapperChild>
                    <PrimaryWrapperChild>
                      <DetailsWrapper label={`Asset lifecycle:`} />
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
                      </Row>
                    </PrimaryWrapperChild>
                  </SwitchableView>
                </Col>
              </Row>
            </>
          )
        )}
      </ErrorHandlerComponent>
    </div>
  );
};
export default HardwareAssetDetail;
