import React from "react";
import CampaignTable from "./CampaignTable";
import { CampaignContextProvider } from "./store";

const EmailCampaign = (props) => {
  return (
    <React.Fragment>
      <CampaignContextProvider {...props}>
        <div className="content">
          <CampaignTable {...props} />
        </div>
      </CampaignContextProvider>
    </React.Fragment>
  );
};

export default EmailCampaign;
