import React from "react";
import { IncidentContextProvider } from "../store";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";
import IncidentDetailsNew from "./IncidentDetailsNew";

const Index = (props) => {
  return (
    <IncidentContextProvider {...props}>
      <TaskContextProvider>
        <TagsAndCategoriesContextProvider applicableModules={"incidents"}>
          <IncidentDetailsNew />
        </TagsAndCategoriesContextProvider>
      </TaskContextProvider>
    </IncidentContextProvider>
  );
};

export default Index;
