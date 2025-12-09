import React from "react";
import useDashboardStore from "./useDashboardStore";
export const DashboardContext = React.createContext();
const DashboardContextProvider = ({ children, ...rest }) => {
  let { ...store } = useDashboardStore({
    ...rest,
  });
  return (
    <DashboardContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
export default DashboardContextProvider;
