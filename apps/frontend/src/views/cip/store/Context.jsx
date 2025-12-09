import React from "react";
import useCipStore from "./UseStore";
export const CipContext = React.createContext();
const CipContextProvider = ({ children, ...rest }) => {
  let { ...store } = useCipStore({
    ...rest,
  });
  return (
    <CipContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </CipContext.Provider>
  );
};
export default CipContextProvider;
