import React from "react";
import { ISO14001ContextProvider } from "./store";
import Iso14001 from "./Iso14001";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Iso14001Management = (props) => {
  return (
    <DrawerContextProvider>
      <ISO14001ContextProvider>
        <Iso14001 {...props} />
      </ISO14001ContextProvider>
    </DrawerContextProvider>
  );
};

export default Iso14001Management;
