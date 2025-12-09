import React from "react";

export const PeopleActionsContext = React.createContext();

const PeopleActionsContext = ({ children, value }) => {
  return (
    <PeopleActionsContext.Provider value={value}>
      {children}
    </PeopleActionsContext.Provider>
  );
};
export default PeopleActionsContextProvider;
