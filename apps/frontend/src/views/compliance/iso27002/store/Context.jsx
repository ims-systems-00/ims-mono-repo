import React from "react";
import useStore from "./useStore";
export const ISO27002Context = React.createContext();
const ISO27002ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ISO27002Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ISO27002Context.Provider>
  );
};
export default ISO27002ContextProvider;
