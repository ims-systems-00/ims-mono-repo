import React from "react";
import { CRMContextProvider } from "../store";
import CustomerDetail from "./CustomerDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

const Index = (props) => {
  return (
    <CRMContextProvider {...props}>
      <TaskContextProvider>
        <TagsAndCategoriesContextProvider applicableModules={"customers"}>
          <CustomerDetail />
        </TagsAndCategoriesContextProvider>
      </TaskContextProvider>
    </CRMContextProvider>
  );
};

export default Index;
