import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import CampaignForm from "./CampaignForm";
import { useCampaign } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const CampaignDrawerForm = () => {
  const {
    visitingCampaign,
    updateCampaign,
    updateAndSendCampaign,
    closeCampaign,
  } = useCampaign();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingCampaign} />
      <CampaignForm
        visitingCampaign={visitingCampaign}
        drawerView
        onSubmit={async (data) => {
          await updateCampaign(data);
          closeDrawer("edit-campaign-form");
        }}
        onUpdateAndSend={async (data) => {
          await updateAndSendCampaign(data);
          closeDrawer("edit-campaign-form");
        }}
        onCloseCampaign={async (data) => {
          await closeCampaign(data);
          closeDrawer("edit-campaign-form");
        }}
      />
    </React.Fragment>
  );
};

export default CampaignDrawerForm;
