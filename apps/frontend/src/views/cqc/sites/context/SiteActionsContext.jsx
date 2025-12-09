import React from "react";

export const SiteActionsContext = React.createContext();

const SiteActionsContextProvider = ({ children, value }) => {
  return (
    <SiteActionsContext.Provider value={value}>
      {children}
    </SiteActionsContext.Provider>
  );
};
export default SiteActionsContextProvider;
