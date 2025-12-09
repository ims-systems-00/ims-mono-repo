import React from "react";

export const ComplianceActionsContext = React.createContext();

const ComplianceActionsContextProvider = ({ children, value }) => {
  return (
    <ComplianceActionsContext.Provider value={value}>
      {children}
    </ComplianceActionsContext.Provider>
  );
};
export default ComplianceActionsContextProvider;
