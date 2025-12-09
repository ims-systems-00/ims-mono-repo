import React from "react";

export const CipActionsContext = React.createContext();

const CipActionsContextProvider = ({ children, value }) => {
  return (
    <CipActionsContext.Provider value={value}>
      {children}
    </CipActionsContext.Provider>
  );
};
export default CipActionsContextProvider;
