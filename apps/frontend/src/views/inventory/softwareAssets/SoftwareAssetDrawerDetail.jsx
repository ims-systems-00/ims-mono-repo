import Loading from "@/components/Loader/Loading";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import DocumentsDeleteButton from "./DocumentsDeleteButton";
import SoftwareKeys from "./SoftwareKeys";
import SoftwareOverview from "./SoftwareOverview";
import USER_ACTIONS from "./actions";
import { useSoftwareAssets } from "./store";
import NavigationTabs from "@/components/NavigationTabs";

const PremiseAssetDrawerDetail = (props) => {
  let { processing, software, handleDeleteKey } = useSoftwareAssets();
  let { authUser } = useAccess();
  return (
    <React.Fragment>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_ORGANIZATION]?.error}
        errorMessage="This hardware has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_ORGANIZATION]?.status ? (
          <Loading />
        ) : (
          software && (
            <React.Fragment>
              <DetailsDrawerHeader data={software} />
              <NavigationTabs
                container={false}
                activeTab="overview"
                navigations={[
                  {
                    id: "overview",
                    text: "Overview",
                    icon: (
                      <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                    ),
                    component: <SoftwareOverview data={software} />,
                  },
                  {
                    id: "details",
                    text: "Details",
                    icon: (
                      <i className="ims-icons-20 icon-icon-list-24 me-1"></i>
                    ),
                    component: (
                      <div className="px-2 pt-1">
                        <DetailsWrapper label={`Keys:`} />
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
                        <Row>
                          {software?.tagsAndCategories && (
                            <Col md="12" className="mx-2">
                              <DetailsWrapper
                                label={"Additional Information:"}
                                iconClass={"tim-icons icon-pencil"}
                                value={`Category: ${software?.tagsAndCategories?.name}`}
                                labelClass={"pr-2"}
                              />
                            </Col>
                          )}
                        </Row>
                        <DetailsWrapper label={`Attachments:`} />
                        <Attachments s3Information={software?.docs}>
                          <DocumentsDeleteButton />
                        </Attachments>
                      </div>
                    ),
                  },
                ]}
              />
            </React.Fragment>
          )
        )}
      </ErrorHandlerComponent>
    </React.Fragment>
  );
};

export default PremiseAssetDrawerDetail;
