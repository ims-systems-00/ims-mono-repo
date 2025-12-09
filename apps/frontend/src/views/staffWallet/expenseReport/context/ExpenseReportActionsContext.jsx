import React from "react";

export const ExpenseReportActionsContext = React.createContext();

const ExpenseReportActionsContextProvider = ({ children, value }) => {
  return (
    <ExpenseReportActionsContext.Provider value={value}>
      {children}
    </ExpenseReportActionsContext.Provider>
  );
};
export default ExpenseReportActionsContextProvider;
