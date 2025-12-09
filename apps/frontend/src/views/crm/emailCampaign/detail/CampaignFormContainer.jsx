import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import React, { useContext } from "react";
import CampaignForm from "../CampaignForm";
import { useCampaign } from "../store";

const CampaignFormContainer = () => {
  const {
    visitingCampaign,
    updateCampaign,
    updateAndSendCampaign,
    closeCampaign,
  } = useCampaign();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <CampaignForm
        visitingCampaign={visitingCampaign}
        onSubmit={async (data) => {
          await updateCampaign(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onUpdateAndSend={async (data) => {
          await updateAndSendCampaign(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onCloseCampaign={async (data) => {
          await closeCampaign(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default CampaignFormContainer;
