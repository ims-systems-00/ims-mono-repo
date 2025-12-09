import React from "react";

export const LeavesActionsContext = React.createContext();

const LeavesActionsContextProvider = ({ children, value }) => {
  return (
    <LeavesActionsContext.Provider value={value}>
      {children}
    </LeavesActionsContext.Provider>
  );
};
export default LeavesActionsContextProvider;
