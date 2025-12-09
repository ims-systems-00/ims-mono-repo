import React from "react";
import { SupplierContextProvider } from "../store";
import SupplierDetail from "./SupplierDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Index = (props) => {
  return (
    <SupplierContextProvider {...props}>
      <DrawerContextProvider>
        <TaskContextProvider>
          <SupplierDetail />
        </TaskContextProvider>
      </DrawerContextProvider>
    </SupplierContextProvider>
  );
};

export default Index;
