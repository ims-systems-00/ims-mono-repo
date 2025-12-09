import React from "react";
import useStore from "./useStore";
export const CRMContext = React.createContext();
const CRMContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    ...rest,
  });
  return (
    <CRMContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};
export default CRMContextProvider;
