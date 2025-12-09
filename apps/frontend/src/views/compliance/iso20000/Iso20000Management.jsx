import React from "react";
import { ISO20000ContextProvider } from "./store";
import Iso20000 from "./Iso20000";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Iso20000Management = (props) => {
  return (
    <DrawerContextProvider>
      <ISO20000ContextProvider {...props}>
        <Iso20000 {...props} />
      </ISO20000ContextProvider>
    </DrawerContextProvider>
  );
};

export default Iso20000Management;
