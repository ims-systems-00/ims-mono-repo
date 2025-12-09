import React from "react";
import useStore from "./useStore";
export const AuditContext = React.createContext();
const AuditContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    ...rest,
  });
  return (
    <AuditContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};
export default AuditContextProvider;
