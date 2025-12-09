import React from "react";

export const HardwareActionsContext = React.createContext();

const HardwareActionsContext = ({ children, value }) => {
  return (
    <HardwareActionsContext.Provider value={value}>
      {children}
    </HardwareActionsContext.Provider>
  );
};
export default HardwareActionsContextProvider;
