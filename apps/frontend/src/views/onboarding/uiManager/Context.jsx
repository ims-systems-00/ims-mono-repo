import React from "react";
import useStore from "./useStore";
export const Context = React.createContext();
const ContextProvider = ({ children, steps = {} }) => {
  let { ...store } = useStore({ steps });
  return (
    <Context.Provider
      value={{
        ...store,
        steps,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default ContextProvider;
