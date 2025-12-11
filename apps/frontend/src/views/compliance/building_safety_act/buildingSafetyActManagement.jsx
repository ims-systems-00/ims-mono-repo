import React from "react";

import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { BuildingSafetyActContextProvider } from "./store";
import BuildingSafetyActCompliance from "./buildingSafetyAct";

const buildingSafetyActManagement = (props) => {
  return (
    <DrawerContextProvider>
      <BuildingSafetyActContextProvider {...props}>
        <BuildingSafetyActCompliance />
      </BuildingSafetyActContextProvider>
    </DrawerContextProvider>
  );
};

export default buildingSafetyActManagement;