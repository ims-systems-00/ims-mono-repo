import React from "react";

import { BuildingSafetyActContextProvider } from "./store";
import BuildingSafetyActCompliance from "./buildingSafetyAct";

const buildingSafetyActManagement = (props) => {
  return (
    <BuildingSafetyActContextProvider {...props}>
      <BuildingSafetyActCompliance />
    </BuildingSafetyActContextProvider>
  );
};

export default buildingSafetyActManagement;
