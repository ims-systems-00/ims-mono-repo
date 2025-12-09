import React from "react";

export const PremisesActionsContext = React.createContext();

const PremisesActionsContext = ({ children, value }) => {
  return (
    <PremisesActionsContext.Provider value={value}>
      {children}
    </PremisesActionsContext.Provider>
  );
};
export default PremisesActionsContextProvider;
