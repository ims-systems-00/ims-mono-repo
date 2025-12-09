import React from "react";
import useStore from "./useStore";
export const Context = React.createContext();
const ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    onDelete: rest.onDelete,
  });
  return (
    <Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default ContextProvider;
