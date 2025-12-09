import React from "react";
import { CRMContextProvider } from "../store";
import CustomerDetail from "./CustomerDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

const Index = (props) => {
  return (
    <CRMContextProvider {...props}>
      <DrawerContextProvider>
        <TaskContextProvider>
          <TagsAndCategoriesContextProvider applicableModules={"customers"}>
            <CustomerDetail />
          </TagsAndCategoriesContextProvider>
        </TaskContextProvider>
      </DrawerContextProvider>
    </CRMContextProvider>
  );
};

export default Index;
