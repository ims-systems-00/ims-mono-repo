import React from "react";
import useSoftwareAssetsStore from "./useSoftwareAssetsStore";
export const SoftwareAssetsContext = React.createContext();
const SoftwareAssetsContextProvider = ({ children, ...rest }) => {
  let { ...store } = useSoftwareAssetsStore({
    ...rest,
  });
  return (
    <SoftwareAssetsContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </SoftwareAssetsContext.Provider>
  );
};
export default SoftwareAssetsContextProvider;
