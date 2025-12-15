import React from "react";
import { ISO27001_Annex_AContextProvider } from "./store";
import Iso27001_2022AnnexACompliance from "./Iso27001_2022AnnexA";

const Iso_27001_Annex_AManagement = (props) => {
  return (
    <ISO27001_Annex_AContextProvider {...props}>
      <Iso27001_2022AnnexACompliance {...props} />
    </ISO27001_Annex_AContextProvider>
  );
};

export default Iso_27001_Annex_AManagement;
