import React from "react";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { ReportsContextProvider } from "./store";
import ReportsContainer from "./ReportsContainer";
function Reports() {
  return (
    <DrawerContextProvider>
      <ReportsContextProvider>
        <ReportsContainer/>
      </ReportsContextProvider>
    </DrawerContextProvider>
  );
}

export default Reports;
