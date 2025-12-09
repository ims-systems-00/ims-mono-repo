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
import OrganisationAssetOverview from "../OrganisationAssetOverview";
import USER_ACTIONS from "../actions";
import { useOrganizationAssets } from "../store";
import OrganizationAssetsFormContainer from "./OganizationAssetsFormContainer";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";

const OrganisationAssetDetail = (props) => {
  const currentUser = getCurrentUserInfo();
  let { authUser } = useAccess(currentUser);
  let { organization, processing } = useOrganizationAssets();

  return (
    <div className="content">
      <h4 className="mb-3 text-primary fw-bold">Information asset details</h4>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_ORGANIZATION].error}
        errorMessage="This information asset has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_ORGANIZATION].status ? (
          <Loading />
        ) : (
          organization && (
            <Row>
              <Col xl="4" sm="12">
                <DetailsSidebar
                  title="Details"
                  iconClass="ims-icons-20 icon-document-regular"
                  label={`Raised on ${moment(organization?.created?.on).format(
                    "DD/MM/YYYY"
                  )}`}
                >
                  <OrganisationAssetOverview data={organization} />
                </DetailsSidebar>
              </Col>
              <Col xl="8" sm="12" className="mb-3">
                <SwitchableView
                  viewTitle={organization.title}
                  canSwitch={authUser({
                    service: IMS_SERVICES.INVENTORY,
                    action: ACTIONS.CREATE,
                    effect: EFFECTS.ALLOW,
                  })}
                >
                  <SecondaryWrapperChild>
                    <OrganizationAssetsFormContainer />
                  </SecondaryWrapperChild>
                  <PrimaryWrapperChild>
                    <Row>
                      <Col md="12">
                        <DetailsSectionContent
                          label={"Information inventory:"}
                          value={organization.informationInventory}
                        />
                      </Col>
                      <Col md="12">
                        <DetailsSectionContent
                          label={"Format:"}
                          value={organization.format}
                        />
                      </Col>
                      <Col md="12">
                        <DetailsSectionContent
                          label={"Storage location:"}
                          value={organization.storageLocation}
                        />
                      </Col>
                      <Col md="12">
                        <DetailsSectionContent
                          label={"Link:"}
                          value={organization.link}
                        />
                      </Col>
                      {organization?.tagsAndCategories && (
                        <DetailsWrapper
                          label={"Additional Information:"}
                          iconClass={"tim-icons icon-pencil"}
                          value={`Category: ${organization?.tagsAndCategories?.name}`}
                          labelClass={"pr-2"}
                        />
                      )}
                    </Row>
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
export default OrganisationAssetDetail;
