import useAlerts from "@/hooks/useAlerts";
import React from "react";

export const AlertContext = React.createContext();

const AlertContextProvider = ({ children }) => {
  let { alert, popUpAlerts } = useAlerts();
  return (
    <AlertContext.Provider
      value={{
        alerts: {
          popUpAlerts,
        },
      }}
    >
      {alert}
      {children}
    </AlertContext.Provider>
  );
};
export default AlertContextProvider;
