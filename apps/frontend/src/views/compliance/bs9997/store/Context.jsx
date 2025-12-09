import React from "react";
import useStore from "./useStore";
export const BS9997Context = React.createContext();
const BS9997ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <BS9997Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </BS9997Context.Provider>
  );
};
export default BS9997ContextProvider;
