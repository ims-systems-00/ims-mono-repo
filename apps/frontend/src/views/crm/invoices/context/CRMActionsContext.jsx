import React from "react";

export const CRMActionsContext = React.createContext();

const CRMActionsContextProvider = ({ children, value }) => {
  return (
    <CRMActionsContext.Provider value={value}>
      {children}
    </CRMActionsContext.Provider>
  );
};
export default CRMActionsContextProvider;
