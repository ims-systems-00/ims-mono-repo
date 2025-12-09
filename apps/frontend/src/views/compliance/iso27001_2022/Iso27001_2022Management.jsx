import React from "react";
import { ISO27001_2022ContextProvider } from "./store";
import Iso27001_2022Compliance from "./Iso27001_2022";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Iso27001_2022Management = (props) => {
  return (
    <DrawerContextProvider>
      <ISO27001_2022ContextProvider {...props}>
        <Iso27001_2022Compliance {...props} />
      </ISO27001_2022ContextProvider>
    </DrawerContextProvider>
  );
};

export default Iso27001_2022Management;
