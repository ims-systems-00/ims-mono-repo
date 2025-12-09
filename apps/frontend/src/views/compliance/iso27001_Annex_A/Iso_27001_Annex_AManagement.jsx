import React from "react";
import { ISO27001_Annex_AContextProvider } from "./store";
import Iso27001_2022AnnexACompliance from "./Iso27001_2022AnnexA";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Iso_27001_Annex_AManagement = (props) => {
  return (
    <DrawerContextProvider>
      <ISO27001_Annex_AContextProvider {...props}>
        <Iso27001_2022AnnexACompliance {...props} />
      </ISO27001_Annex_AContextProvider>
    </DrawerContextProvider>
  );
};

export default Iso_27001_Annex_AManagement;
