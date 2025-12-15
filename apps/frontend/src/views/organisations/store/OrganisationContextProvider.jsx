import React from "react";
import useOrganisation from "./useOrganisation";
export const OrganisationContext = React.createContext();
const OrganisationContextProvider = ({ children, ...rest }) => {
  let { ...store } = useOrganisation({
    ...rest,
  });
  return (
    <OrganisationContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </OrganisationContext.Provider>
  );
};
export default OrganisationContextProvider;
