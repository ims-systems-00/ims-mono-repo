import React from "react";
import useStore from "./useStore";
export const ISO9001Context = React.createContext();
const ISO9001ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ISO9001Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ISO9001Context.Provider>
  );
};
export default ISO9001ContextProvider;
