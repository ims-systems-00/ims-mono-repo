import React from "react";
import { DSPTContextProvider } from "./store";
import DsptTables from "./Dspt";

const DsptManagement = (props) => {
  return (
    <DSPTContextProvider {...props}>
      <DsptTables {...props} />
    </DSPTContextProvider>
  );
};

export default DsptManagement;
