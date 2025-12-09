import React from "react";
import useStore from "./useStore";
export const ISO45001Context = React.createContext();
const ISO45001ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ISO45001Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ISO45001Context.Provider>
  );
};
export default ISO45001ContextProvider;
