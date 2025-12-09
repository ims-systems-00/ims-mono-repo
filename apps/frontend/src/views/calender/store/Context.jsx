import React from "react";
import useCalenderStore from "./useCalenderStore";
export const CalenderContext = React.createContext();
const CalenderContextProvider = ({ children, ...rest }) => {
  let { ...store } = useCalenderStore();
  return (
    <CalenderContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </CalenderContext.Provider>
  );
};
export default CalenderContextProvider;
