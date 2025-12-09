import React from "react";
import useRiskStore from "./useRiskStore";
export const RiskContext = React.createContext();
const RiskContextProvider = ({ children, ...rest }) => {
  let { ...store } = useRiskStore({
    ...rest,
  });
  return (
    <RiskContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </RiskContext.Provider>
  );
};
export default RiskContextProvider;
