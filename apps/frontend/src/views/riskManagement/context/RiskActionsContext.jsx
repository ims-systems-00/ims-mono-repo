import React from "react";

export const RiskActionsContext = React.createContext();

const RiskActionsContextProvider = ({ children, value }) => {
  return (
    <RiskActionsContext.Provider value={value}>
      {children}
    </RiskActionsContext.Provider>
  );
};
export default RiskActionsContextProvider;
