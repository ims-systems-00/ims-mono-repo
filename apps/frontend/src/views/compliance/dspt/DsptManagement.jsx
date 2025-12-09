import React from "react";
import { DSPTContextProvider } from "./store";
import DsptTables from "./Dspt";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const DsptManagement = (props) => {
  return (
    <DrawerContextProvider>
      <DSPTContextProvider {...props}>
        <DsptTables {...props} />
      </DSPTContextProvider>
    </DrawerContextProvider>
  );
};

export default DsptManagement;
