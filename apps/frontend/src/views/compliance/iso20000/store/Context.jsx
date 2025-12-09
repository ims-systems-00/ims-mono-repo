import React from "react";
import useStore from "./useStore";
export const ISO20000Context = React.createContext();
const ISO20000ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ISO20000Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ISO20000Context.Provider>
  );
};
export default ISO20000ContextProvider;
