import React from "react";
import { AuditContextProvider } from "../store";
import AuditDetail from "./AuditDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
const Index = (props) => {
  return (
    <AuditContextProvider {...props}>
      <DrawerContextProvider>
        <TaskContextProvider>
          <AuditDetail />
        </TaskContextProvider>
      </DrawerContextProvider>
    </AuditContextProvider>
  );
};

export default Index;
