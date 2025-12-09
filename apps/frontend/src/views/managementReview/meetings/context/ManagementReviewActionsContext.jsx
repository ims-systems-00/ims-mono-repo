import React from "react";

export const ManagementReviewActionsContext = React.createContext();

const ManagementReviewActionsContextProvider = ({ children, value }) => {
  return (
    <ManagementReviewActionsContext.Provider value={value}>
      {children}
    </ManagementReviewActionsContext.Provider>
  );
};
export default ManagementReviewActionsContextProvider;
