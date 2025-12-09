import React from "react";
import useStore from "./useStore";
export const InvoiceContext = React.createContext();
const InvoiceContextProvider = ({ children, customer, ...rest }) => {
  let { ...store } = useStore({
    customer,
    ...rest,
  });
  return (
    <InvoiceContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
export default InvoiceContextProvider;
