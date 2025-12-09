import React from "react";
import useStore from "./useStore";
export const ISO14001Context = React.createContext();
const ISO14001ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ISO14001Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ISO14001Context.Provider>
  );
};
export default ISO14001ContextProvider;
