import React from "react";
import useStore from "./useStore";
export const ISO15686Context = React.createContext();
const ISO15686ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ISO15686Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ISO15686Context.Provider>
  );
};
export default ISO15686ContextProvider;
