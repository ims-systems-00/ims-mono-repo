import React from "react";
import usePremiseAssetsStore from "./usePremiseAssetsStore";
export const PremiseAssetsContext = React.createContext();
const PremiseAssetsContextProvider = ({ children, ...rest }) => {
  let { ...store } = usePremiseAssetsStore({
    ...rest,
  });
  return (
    <PremiseAssetsContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </PremiseAssetsContext.Provider>
  );
};
export default PremiseAssetsContextProvider;
