import React from "react";

export const TaskActionsContext = React.createContext();

const TaskActionsContextProvider = ({ children, value }) => {
  return (
    <TaskActionsContext.Provider value={value}>
      {children}
    </TaskActionsContext.Provider>
  );
};
export default TaskActionsContextProvider;
