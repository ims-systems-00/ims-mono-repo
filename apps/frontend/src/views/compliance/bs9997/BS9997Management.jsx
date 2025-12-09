import React from "react";
import { BS9997ContextProvider } from "./store";
import BS9997 from "./BS9997";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const BS9997Management = (props) => {
  return (
    <DrawerContextProvider>
      <BS9997ContextProvider {...props}>
        <BS9997 {...props} />
      </BS9997ContextProvider>
    </DrawerContextProvider>
  );
};

export default BS9997Management;
