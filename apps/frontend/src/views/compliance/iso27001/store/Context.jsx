import React from "react";
import useStore from "./useStore";
export const ISO27001Context = React.createContext();
const ISO27001ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ISO27001Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ISO27001Context.Provider>
  );
};
export default ISO27001ContextProvider;
