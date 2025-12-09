import React from "react";
import useStore from "./useStore";
import Loading from "@/components/Loader/Loading";
export const Context = React.createContext();
const ContextProvider = ({ children }) => {
  let { ...store } = useStore({});
  return (
    <Context.Provider
      value={{
        ...store,
      }}
    >
      {!store.isApplicationReady ? <Loading /> : children}
    </Context.Provider>
  );
};
export default ContextProvider;
