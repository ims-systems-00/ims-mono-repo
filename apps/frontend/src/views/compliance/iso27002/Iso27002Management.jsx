import React from "react";
import { ISO27002ContextProvider } from "./store";
import Iso27002Compliance from "./Iso27002";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Iso27002Management = (props) => {
  return (
    <DrawerContextProvider>
      <ISO27002ContextProvider {...props}>
        <Iso27002Compliance {...props} />
      </ISO27002ContextProvider>
    </DrawerContextProvider>
  );
};

export default Iso27002Management;
