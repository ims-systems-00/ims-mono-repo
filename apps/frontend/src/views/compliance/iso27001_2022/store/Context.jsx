import React from "react";
import useStore from "./useStore";
export const ISO27001_2022Context = React.createContext();
const ISO27001_2022ContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore();
  return (
    <ISO27001_2022Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ISO27001_2022Context.Provider>
  );
};
export default ISO27001_2022ContextProvider;
