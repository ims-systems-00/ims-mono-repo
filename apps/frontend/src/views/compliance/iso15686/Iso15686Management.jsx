import React from "react";
import { ISO15686ContextProvider } from "./store";
import Iso15686 from "./Iso15686";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Iso15686Management = (props) => {
  return (
    <DrawerContextProvider>
      <ISO15686ContextProvider {...props}>
        <Iso15686 {...props} />
      </ISO15686ContextProvider>
    </DrawerContextProvider>
  );
};

export default Iso15686Management;
