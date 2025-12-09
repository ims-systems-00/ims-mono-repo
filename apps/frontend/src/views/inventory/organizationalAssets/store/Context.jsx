import React from "react";
import useOrganizationAssetsStore from "./useOrganizationAssetsStore";
export const OrganizationAssetsContext = React.createContext();
const OrganizationAssetsContextProvider = ({ children, ...rest }) => {
  let { ...store } = useOrganizationAssetsStore({
    ...rest,
  });
  return (
    <OrganizationAssetsContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </OrganizationAssetsContext.Provider>
  );
};
export default OrganizationAssetsContextProvider;
