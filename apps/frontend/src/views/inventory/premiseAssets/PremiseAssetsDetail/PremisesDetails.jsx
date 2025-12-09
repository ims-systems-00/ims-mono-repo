import React from "react";
// @ims-systems-00/ims-ui-kit components
import Loading from "@/components/Loader/Loading";
import { Panels, Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentUserInfo } from "@/services/userServices";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import PremiseAssetForm from "../PremiseAssetForm";
import PremiseOverview from "../PremiseOverview";
import USER_ACTIONS from "../actions";
import { usePremiseAssets } from "../store";
import PremisesAssetsFormContainer from "./PremisesAssetsFormContainer";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";

const PremisesDetail = (props) => {
  const currentUser = getCurrentUserInfo();
  let { authUser } = useAccess(currentUser);
  let { processing, premise } = usePremiseAssets();

  return (
    <div className="content">
      <h4 className="mb-3 text-primary fw-bold">Premise asset details</h4>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_PREMISE].error}
        errorMessage="This premise asset has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_PREMISE].status ? (
          <Loading />
        ) : (
          premise && (
            <Row>
              <Col xl="4" sm="12">
                <DetailsSidebar
                  title="Details"
                  iconClass="ims-icons-20 icon-document-regular"
                  label={`Raised on ${moment(premise?.created?.on).format(
                    "DD/MM/YYYY"
                  )}`}
                >
                  <PremiseOverview data={premise} />
                </DetailsSidebar>
              </Col>
              <Col xl="8" sm="12" className="mb-3">
                <SwitchableView
                  viewTitle={premise.name}
                  canSwitch={authUser({
                    service: IMS_SERVICES.INVENTORY,
                    action: ACTIONS.CREATE,
                    effect: EFFECTS.ALLOW,
                  })}
                >
                  <SecondaryWrapperChild>
                    <PremisesAssetsFormContainer />
                  </SecondaryWrapperChild>

                  <PrimaryWrapperChild>
                    <Col md="12">
                      <DetailsSectionContent
                        label={"Address:"}
                        value={premise.address}
                      />
                    </Col>
                    <Col md="12">
                      <DetailsSectionContent
                        label={"Postal code:"}
                        value={premise.location}
                      />
                    </Col>
                    {premise?.tagsAndCategories && (
                      <DetailsWrapper
                        label={"Additional Information:"}
                        iconClass={"tim-icons icon-pencil"}
                        value={`Category: ${premise?.tagsAndCategories?.name}`}
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

export default PremisesDetail;
