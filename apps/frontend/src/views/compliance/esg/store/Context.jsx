import React from "react";
import useStore from "./useStore";
export const ESGContext = React.createContext();
const ESGContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ESGContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ESGContext.Provider>
  );
};
export default ESGContextProvider;
