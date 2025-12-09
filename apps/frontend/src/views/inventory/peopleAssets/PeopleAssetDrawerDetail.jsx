import React from "react";
import { usePeopleAssets } from "./store";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import USER_ACTIONS from "./actions";
import Loading from "@/components/Loader/Loading";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import PeopleAssetOverview from "./PeopleAssetOverview";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import NavigationTabs from "@/components/NavigationTabs";

const PeopleAssetDrawerDetail = (props) => {
  let { processing, people } = usePeopleAssets();
  return (
    <React.Fragment>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_PEOPLE]?.error}
        errorMessage="This hardware has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_PEOPLE]?.status ? (
          <Loading />
        ) : (
          people && (
            <React.Fragment>
              <DetailsDrawerHeader data={people} />
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
                    component: <PeopleAssetOverview data={people} />,
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
                          label={"Responsibility:"}
                          value={people.responsibility}
                        />
                        <DetailsSectionContent
                          label={"Skill:"}
                          value={people.skill}
                        />
                        <Row>
                          {people?.tagsAndCategories && (
                            <Col md="12" className="mx-2">
                              <DetailsWrapper
                                label={"Additional Information:"}
                                iconClass={"tim-icons icon-pencil"}
                                value={`Category: ${people?.tagsAndCategories?.name}`}
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

export default PeopleAssetDrawerDetail;
