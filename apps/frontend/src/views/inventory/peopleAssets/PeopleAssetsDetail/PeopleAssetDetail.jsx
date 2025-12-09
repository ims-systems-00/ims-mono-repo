import Loading from "@/components/Loader/Loading";
import { Panels, Panel } from "@/components/Panel/HorizontalPanel";
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
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import PeopleAssetOverview from "../PeopleAssetOverview";
import USER_ACTIONS from "../actions";
import { usePeopleAssets } from "../store";
import PeopleAssetsFormContainer from "./PeopleAssetsFormContainer";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";

const PeopleAssetDetail = (props) => {
  const currentUser = getCurrentUserInfo();
  const { authUser } = useAccess(currentUser);
  let { processing, people } = usePeopleAssets();

  return (
    <div className="content">
      <h4 className="mb-3 text-primary fw-bold">People asset details</h4>

      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_PEOPLE].error}
        errorMessage="This people asset has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_PEOPLE].status ? (
          <Loading />
        ) : (
          people && (
            <Row>
              <Col xl="4" sm="12">
                <DetailsSidebar
                  title="Details"
                  iconClass="ims-icons-20 icon-document-regular"
                  label={`Raised on ${moment(people?.created?.on).format(
                    "DD/MM/YYYY"
                  )}`}
                >
                  <PeopleAssetOverview data={people} />
                </DetailsSidebar>
              </Col>
              <Col xl="8" sm="12" className="mb-3">
                <SwitchableView
                  viewTitle={people.name}
                  canSwitc={authUser({
                    service: IMS_SERVICES.INVENTORY,
                    action: ACTIONS.CREATE,
                    effect: EFFECTS.ALLOW,
                  })}
                >
                  <SecondaryWrapperChild>
                    <PeopleAssetsFormContainer />
                  </SecondaryWrapperChild>

                  <PrimaryWrapperChild>
                    <Col md="12">
                      <DetailsSectionContent
                        label={"Responsibility:"}
                        value={people.responsibility}
                      />
                    </Col>
                    <Col md="12">
                      <DetailsSectionContent
                        label={"Skill:"}
                        value={people.skill}
                      />
                    </Col>
                    {people?.tagsAndCategories && (
                      <DetailsWrapper
                        label={"Additional Information:"}
                        iconClass={"tim-icons icon-pencil"}
                        value={`Category: ${people?.tagsAndCategories?.name}`}
                        labelClass={"pr-2"}
                      />
                    )}
                  </PrimaryWrapperChild>
                </SwitchableView>
              </Col>
            </Row>
          )
        )}
      </ErrorHandlerComponent>
    </div>
  );
};
export default PeopleAssetDetail;
