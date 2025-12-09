import React from "react";

export const WhistleblowActionsContext = React.createContext();

const WhistleblowActionsContextProvider = ({ children, value }) => {
  return (
    <WhistleblowActionsContext.Provider value={value}>
      {children}
    </WhistleblowActionsContext.Provider>
  );
};
export default WhistleblowActionsContextProvider;
