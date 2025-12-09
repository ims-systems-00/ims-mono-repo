import React from "react";

export const EmailCampaignActionsContext = React.createContext();

const EmailCampaignActionsContextProvider = ({ children, value }) => {
  return (
    <EmailCampaignActionsContext.Provider value={value}>
      {children}
    </EmailCampaignActionsContext.Provider>
  );
};
export default EmailCampaignActionsContextProvider;
