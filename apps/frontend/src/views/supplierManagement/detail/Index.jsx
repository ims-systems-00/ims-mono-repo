import React from "react";
import { SupplierContextProvider } from "../store";
import SupplierDetail from "./SupplierDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";

const Index = (props) => {
  return (
    <SupplierContextProvider {...props}>
      <TaskContextProvider>
        <SupplierDetail />
      </TaskContextProvider>
    </SupplierContextProvider>
  );
};

export default Index;
