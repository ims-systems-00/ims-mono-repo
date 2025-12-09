import React from "react";

export const AuditActionsContext = React.createContext();

const AuditActionsContextProvider = ({ children, value }) => {
  return (
    <AuditActionsContext.Provider value={value}>
      {children}
    </AuditActionsContext.Provider>
  );
};
export default AuditActionsContextProvider;
