import React from "react";
import useTaskStore from "./useTaskStore";
export const TaskContext = React.createContext();
const TaskContextProvider = ({ children, ...rest }) => {
  let { ...store } = useTaskStore({
    ...rest,
  });
  return (
    <TaskContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
export default TaskContextProvider;
