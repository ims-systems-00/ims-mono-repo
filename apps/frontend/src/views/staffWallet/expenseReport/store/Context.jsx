import React from "react";
import useStore from "./useStore";
export const ExpenseReportContext = React.createContext();

const ExpenseReportContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    ...rest,
  });
  return (
    <ExpenseReportContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ExpenseReportContext.Provider>
  );
};

export default ExpenseReportContextProvider;
