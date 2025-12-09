import React from "react";
import useStore from "./useStore";
export const BuildingSafetyActContext = React.createContext();
const BuildingSafetyActContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <BuildingSafetyActContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </BuildingSafetyActContext.Provider>
  );
};
export default BuildingSafetyActContextProvider;
