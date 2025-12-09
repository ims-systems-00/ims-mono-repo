import React from "react";
import useStore from "./useStore";
export const DSPTContext = React.createContext();
const DSPTContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <DSPTContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </DSPTContext.Provider>
  );
};
export default DSPTContextProvider;
