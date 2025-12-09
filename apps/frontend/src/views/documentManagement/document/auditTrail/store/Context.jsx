import React from "react";
import useAuditTrailStore from "./useAuditTrailStore";
export const AuditTrailContext = React.createContext();
const AuditTrailContextProvider = ({ children, document }) => {
  let { ...store } = useAuditTrailStore({ document });
  return (
    <AuditTrailContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </AuditTrailContext.Provider>
  );
};
export default AuditTrailContextProvider;
