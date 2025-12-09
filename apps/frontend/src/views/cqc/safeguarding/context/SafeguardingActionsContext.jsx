import React from "react";

export const SafeguardingActionsContext = React.createContext();

const SafeguardingActionsContextProvider = ({ children, value }) => {
  return (
    <SafeguardingActionsContext.Provider value={value}>
      {children}
    </SafeguardingActionsContext.Provider>
  );
};
export default SafeguardingActionsContextProvider;
