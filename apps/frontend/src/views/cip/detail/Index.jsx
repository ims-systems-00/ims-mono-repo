import React from "react";
import { CipContextProvider } from "../store";
import ContinualImprovementPlanDetail from "./ContinualImprovementPlanDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";

const Index = (props) => {
  return (
    <CipContextProvider {...props}>
      <TaskContextProvider>
        <ContinualImprovementPlanDetail />
      </TaskContextProvider>
    </CipContextProvider>
  );
};

export default Index;
