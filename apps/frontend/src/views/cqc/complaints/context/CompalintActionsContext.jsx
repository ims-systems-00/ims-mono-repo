import React from "react";

export const ComplaintActionsContext = React.createContext();

const ComplaintActionsContextProvider = ({ children, value }) => {
  return (
    <ComplaintActionsContext.Provider value={value}>
      {children}
    </ComplaintActionsContext.Provider>
  );
};
export default ComplaintActionsContextProvider;
