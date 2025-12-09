import React from "react";

export const IncidentActionsContext = React.createContext();

const IncidentActionsContextProvider = ({ children, value }) => {
  return (
    <IncidentActionsContext.Provider value={value}>
      {children}
    </IncidentActionsContext.Provider>
  );
};
export default IncidentActionsContextProvider;
