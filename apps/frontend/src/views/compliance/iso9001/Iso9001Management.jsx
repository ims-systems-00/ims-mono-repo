import React from "react";
import { ISO9001ContextProvider } from "./store";
import Iso9001Compliance from "./Iso9001";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Iso9001Management = (props) => {
  return (
    <DrawerContextProvider>
      <ISO9001ContextProvider {...props}>
        <Iso9001Compliance {...props} />
      </ISO9001ContextProvider>
    </DrawerContextProvider>
  );
};

export default Iso9001Management;
