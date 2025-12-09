import React from "react";

export const ToolActionsContext = React.createContext();

const ToolActionsContextProvider = ({ children, value }) => {
  return (
    <ToolActionsContext.Provider value={value}>
      {children}
    </ToolActionsContext.Provider>
  );
};
export default ToolActionsContextProvider;
