import Loading from "@/components/Loader/Loading";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import USER_ACTIONS from "./actions";
import { usePremiseAssets } from "./store";
import PremiseOverview from "./PremiseOverview";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import NavigationTabs from "@/components/NavigationTabs";

const PremiseAssetDrawerDetail = (props) => {
  let { processing, premise } = usePremiseAssets();
  return (
    <React.Fragment>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_ORGANIZATION]?.error}
        errorMessage="This hardware has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_ORGANIZATION]?.status ? (
          <Loading />
        ) : (
          premise && (
            <React.Fragment>
              <DetailsDrawerHeader data={premise} />
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
                    component: <PremiseOverview data={premise} />,
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
                          label={"Address:"}
                          value={premise.address}
                        />
                        <DetailsSectionContent
                          label={"Postal code:"}
                          value={premise.location}
                        />
                        <Row>
                          {premise?.tagsAndCategories && (
                            <Col md="12" className="mx-2">
                              <DetailsWrapper
                                label={"Additional Information:"}
                                iconClass={"tim-icons icon-pencil"}
                                value={`Category: ${premise?.tagsAndCategories?.name}`}
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

export default PremiseAssetDrawerDetail;
