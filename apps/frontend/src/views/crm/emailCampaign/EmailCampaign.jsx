import React from "react";
import CampaignTable from "./CampaignTable";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { CampaignContextProvider } from "./store";

const EmailCampaign = (props) => {
  return (
    <React.Fragment>
      <DrawerContextProvider>
        <CampaignContextProvider {...props}>
          <div className="content">
            <CampaignTable {...props} />
          </div>
        </CampaignContextProvider>
      </DrawerContextProvider>
    </React.Fragment>
  );
};

export default EmailCampaign;
