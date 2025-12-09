import React from "react";
import useStore from "./useStore";
export const ISO27001_Annex_AContext = React.createContext();
const ISO27001_Annex_AContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ISO27001_Annex_AContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ISO27001_Annex_AContext.Provider>
  );
};
export default ISO27001_Annex_AContextProvider;
