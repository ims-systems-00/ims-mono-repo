import React from "react";
import { ISO9001ContextProvider } from "./store";
import Iso9001Compliance from "./Iso9001";

const Iso9001Management = (props) => {
  return (
    <ISO9001ContextProvider {...props}>
      <Iso9001Compliance {...props} />
    </ISO9001ContextProvider>
  );
};

export default Iso9001Management;
