import React from "react";
import { ESGContextProvider } from "./store";
import ESG from "./ESG";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const ESGManagement = (props) => {
  return (
    <DrawerContextProvider>
      <ESGContextProvider {...props}>
        <ESG {...props} />
      </ESGContextProvider>
    </DrawerContextProvider>
  );
};

export default ESGManagement;
