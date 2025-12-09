import React from "react";
import { ISO45001ContextProvider } from "./store";
import Iso45001 from "./Iso45001";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Iso45001Management = (props) => {
  return (
    <DrawerContextProvider>
      <ISO45001ContextProvider {...props}>
        <Iso45001 {...props} />
      </ISO45001ContextProvider>
    </DrawerContextProvider>
  );
};

export default Iso45001Management;
