import Loading from "@/components/Loader/Loading";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import USER_ACTIONS from "./actions";
import { useOrganizationAssets } from "./store";
import OrganisationAssetOverview from "./OrganisationAssetOverview";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import NavigationTabs from "@/components/NavigationTabs";

const OrganizationAssetDrawerDetail = (props) => {
  let { processing, organization } = useOrganizationAssets();
  return (
    <React.Fragment>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_ORGANIZATION]?.error}
        errorMessage="This hardware has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_ORGANIZATION]?.status ? (
          <Loading />
        ) : (
          organization && (
            <React.Fragment>
              <DetailsDrawerHeader data={organization} />
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
                    component: (
                      <OrganisationAssetOverview data={organization} />
                    ),
                  },
                  {
                    id: "details",
                    text: "Details",
                    icon: (
                      <i className="ims-icons-20 icon-icon-list-24 me-1"></i>
                    ),
                    component: (
                      <div className="px-2 pt-3">
                        <DetailsSectionContent
                          label={"Information inventory:"}
                          value={organization.informationInventory}
                        />
                        <DetailsSectionContent
                          label={"Format:"}
                          value={organization.format}
                        />
                        <DetailsSectionContent
                          label={"Storage location:"}
                          value={organization.storageLocation}
                        />
                        <DetailsSectionContent
                          label={"Link:"}
                          value={organization.link}
                        />
                        <Row>
                          {organization?.tagsAndCategories && (
                            <Col md="12" className="mx-2">
                              <DetailsWrapper
                                label={"Additional Information:"}
                                iconClass={"tim-icons icon-pencil"}
                                value={`Category: ${organization?.tagsAndCategories?.name}`}
                                labelClass={"pr-2"}
                              />
                            </Col>
                          )}
                        </Row>
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

export default OrganizationAssetDrawerDetail;
