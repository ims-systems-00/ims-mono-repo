import React from "react";
import { CipContextProvider } from "../store";
import ContinualImprovementPlanDetail from "./ContinualImprovementPlanDetail";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Index = (props) => {
  return (
    <CipContextProvider {...props}>
      <DrawerContextProvider>
        <TaskContextProvider>
          <ContinualImprovementPlanDetail />
        </TaskContextProvider>
      </DrawerContextProvider>
    </CipContextProvider>
  );
};

export default Index;
