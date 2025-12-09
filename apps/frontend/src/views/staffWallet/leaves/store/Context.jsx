import React from "react";
import useStore from "./useStore";
export const LeaveContext = React.createContext();

const LeaveContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    ...rest,
  });
  return (
    <LeaveContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export default LeaveContextProvider;
