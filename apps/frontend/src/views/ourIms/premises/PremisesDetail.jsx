import Loading from "@/components/Loader/Loading";
import { Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getGroupPremise } from "@/services/iamGroupPremisesServices";
import { imsLogger } from "@/services/loggerService";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import PremisesForm from "./PremisesForm";

const PremisesDetail = (props) => {
  const { isModalOpen = false } = props;
  let notify = React.useContext(NotificationContext);
  let [premise, setPremise] = React.useState({});
  let [processing, setProcessing] = React.useState({
    action: "load-premise",
    id: null,
  });
  let { authUser, authSuperUser, entityAccessControl } = useAccess();
  let refreshPremise = (premise) => {
    setPremise(premise);
    props.onUpdate && props.onUpdate(premise);
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getGroupPremise(id);
        setPremise(data.iamGroupPremise);
      } catch (ex) {
        imsLogger("PremisesDetail", ex, ex.response);
        notify("Error occured while fetching data", "danger");
      }
      setProcessing({ action: null, id: null });
    }
    fetchData();
  }, []);
  function getAllowedUsers() {
    return premise && premise.created.by ? [premise.created.by._id] : [];
  }
  imsLogger("PremisesDetail", premise);
  return (
    <React.Fragment>
      <div className="content">
        <Panel panelId="Details">
          {processing.action === "load-premise" ? (
            <Loading />
          ) : (
            <SwitchableView
              viewTitle={premise.name}
              canSwitch={
                (authUser({
                  service: IMS_SERVICES.IAM_PREMISES,
                  action: ACTIONS.CREATE,
                  effect: EFFECTS.ALLOW,
                }) &&
                  entityAccessControl({
                    users: [...getAllowedUsers()],
                    effect: "Allow",
                  })) ||
                authSuperUser()
              }
            >
              <SecondaryWrapperChild>
                {processing.action === "load-premise" ? (
                  <Loading />
                ) : (
                  <PremisesForm
                    premise={premise}
                    processing={processing}
                    setProcessing={setProcessing}
                    refreshPremise={refreshPremise}
                  />
                )}
              </SecondaryWrapperChild>
              <PrimaryWrapperChild>
                <Row>
                  <Col md="12">
                    <DetailsSectionContent
                      label="Business units:"
                      value={premise.groups.map((group) => (
                        <p key={group._id}>{group.name}</p>
                      ))}
                    />
                  </Col>

                  <Col md="12">
                    <DetailsSectionContent
                      label="Location:"
                      value={premise.location}
                    />
                  </Col>
                  <Col md="12">
                    <DetailsSectionContent
                      label="Address:"
                      value={premise.address}
                    />
                  </Col>
                </Row>
              </PrimaryWrapperChild>
            </SwitchableView>
          )}
        </Panel>
      </div>
    </React.Fragment>
  );
};

export default PremisesDetail;
