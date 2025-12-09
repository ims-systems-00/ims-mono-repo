import React from "react";

export const KpiObjectiveActionsContext = React.createContext();

const KpiObjectiveActionsContextProvider = ({ children, value }) => {
  return (
    <KpiObjectiveActionsContext.Provider value={value}>
      {children}
    </KpiObjectiveActionsContext.Provider>
  );
};
export default KpiObjectiveActionsContextProvider;
