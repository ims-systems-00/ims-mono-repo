import React from "react";
// @ims-systems-00/ims-ui-kit components
import Loading from "@/components/Loader/Loading";
import { Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentUserInfo } from "@/services/userServices";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import DocumentsButtons from "../DocumentsDeleteButton";
import SoftwareKeyForm from "../SoftwareKeyForm";
import SoftwareKeys from "../SoftwareKeys";
import SoftwareOverview from "../SoftwareOverview";
import USER_ACTIONS from "../actions";
import { useSoftwareAssets } from "../store";
import SoftwareAssetsFormContainer from "./SoftwareAssetsFormContainer";

const SoftwareAssetDetail = (props) => {
  const currentUser = getCurrentUserInfo();
  let { authUser } = useAccess(currentUser);
  let { processing, software, handleDeleteKey, handleAddSoftwareKey, alert } =
    useSoftwareAssets();

  return (
    <div className="content">
      <h4 className="mb-3 text-primary fw-bold">Software asset details</h4>
      {alert}
      <Panel panelId="Details">
        <ErrorHandlerComponent
          hasError={processing[USER_ACTIONS.LOAD_SOFTWARE].error}
          errorMessage="This software asset has been deleted or removed"
        >
          {processing[USER_ACTIONS.LOAD_SOFTWARE].status ? (
            <Loading />
          ) : (
            software && (
              <Row>
                <Col xl="4" sm="12">
                  <DetailsSidebar
                    title="Details"
                    iconClass="ims-icons-20 icon-document-regular"
                    label={`Raised on ${moment(software?.created?.on).format(
                      "DD/MM/YYYY"
                    )}`}
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
                      <SoftwareAssetsFormContainer />
                      <SoftwareKeyForm
                        software={software}
                        processing={processing}
                        onSubmit={async (data) => {
                          await handleAddSoftwareKey(software?._id, data);
                        }}
                      />
                      <Row className="mt-3">
                        <Col md="12">
                          {software.keys.length
                            ? software.keys.map((softwareKey) => (
                                <SoftwareKeys
                                  key={softwareKey._id}
                                  processing={processing}
                                  softwareKey={softwareKey}
                                  canDelete={authUser({
                                    service: IMS_SERVICES.INVENTORY,
                                    action: ACTIONS.CREATE,
                                    effect: EFFECTS.ALLOW,
                                  })}
                                  onSubmit={async () => {
                                    await handleDeleteKey(
                                      software._id,
                                      softwareKey._id
                                    );
                                  }}
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
                                  processing={processing}
                                  canDelete={authUser({
                                    service: IMS_SERVICES.INVENTORY,
                                    action: ACTIONS.CREATE,
                                    effect: EFFECTS.ALLOW,
                                  })}
                                  onSubmit={async () => {
                                    await handleDeleteKey(
                                      software._id,
                                      softwareKey._id
                                    );
                                  }}
                                />
                              ))
                            : "None"}
                        </Col>
                      </Row>
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
    </div>
  );
};
export default SoftwareAssetDetail;
