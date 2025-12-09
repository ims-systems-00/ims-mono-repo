import React from "react";
import { TaskContextProvider } from "../store";
import TaskDetail from "./TaskDetail";
const Index = (props) => {
  return (
    <TaskContextProvider {...props}>
      <TaskDetail />
    </TaskContextProvider>
  );
};

export default Index;
