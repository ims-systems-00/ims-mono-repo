import React from "react";
import usePeopleAssetsStore from "./usePeopleAssetsStore";
export const PeopleAssetsContext = React.createContext();
const PeopleAssetsContextProvider = ({ children, ...rest }) => {
  let { ...store } = usePeopleAssetsStore({
    ...rest,
  });
  return (
    <PeopleAssetsContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </PeopleAssetsContext.Provider>
  );
};
export default PeopleAssetsContextProvider;
