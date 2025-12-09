import React from "react";
import { IncidentContextProvider } from "../store";
import IncidentDetails from "./IncidentDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";
import IncidentDetailsNew from "./IncidentDetailsNew";

const Index = (props) => {
  return (
    <IncidentContextProvider {...props}>
      <DrawerContextProvider>
        <TaskContextProvider>
          <TagsAndCategoriesContextProvider applicableModules={"incidents"}>
            <IncidentDetailsNew />
          </TagsAndCategoriesContextProvider>
        </TaskContextProvider>
      </DrawerContextProvider>
    </IncidentContextProvider>
  );
};

export default Index;
