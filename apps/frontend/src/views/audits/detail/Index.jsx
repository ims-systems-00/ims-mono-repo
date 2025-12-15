import React from "react";
import { AuditContextProvider } from "../store";
import AuditDetail from "./AuditDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";
const Index = (props) => {
  return (
    <AuditContextProvider {...props}>
      <TaskContextProvider>
        <AuditDetail />
      </TaskContextProvider>
    </AuditContextProvider>
  );
};

export default Index;
