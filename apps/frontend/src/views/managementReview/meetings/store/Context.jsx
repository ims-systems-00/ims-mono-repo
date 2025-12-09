import React from "react";
import useStore from "./useStore";
export const ScheduleContext = React.createContext();
const ScheduleContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    ...rest,
  });
  return (
    <ScheduleContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
export default ScheduleContextProvider;
