import React from "react";

export const SignificantEventActionsContext = React.createContext();

const SignificantEventActionsContextProvider = ({ children, value }) => {
  return (
    <SignificantEventActionsContext.Provider value={value}>
      {children}
    </SignificantEventActionsContext.Provider>
  );
};
export default SignificantEventActionsContextProvider;
