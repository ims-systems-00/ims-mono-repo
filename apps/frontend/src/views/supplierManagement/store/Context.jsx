import React from "react";
import useStore from "./useStore";
export const SupplierContext = React.createContext();
const SupplierContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    ...rest,
  });
  return (
    <SupplierContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};
export default SupplierContextProvider;
