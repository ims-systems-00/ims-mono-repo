import React from "react";
import { ISO27001ContextProvider } from "./store";
import Iso27001Compliance from "./Iso27001";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const iso27001Management = (props) => {
  return (
    <DrawerContextProvider>
      <ISO27001ContextProvider {...props}>
        <Iso27001Compliance />
      </ISO27001ContextProvider>
    </DrawerContextProvider>
  );
};

export default iso27001Management;
