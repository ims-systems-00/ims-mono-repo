import React from "react";
import { ISO27001ContextProvider } from "./store";
import Iso27001Compliance from "./Iso27001";

const iso27001Management = (props) => {
  return (
    <ISO27001ContextProvider {...props}>
      <Iso27001Compliance />
    </ISO27001ContextProvider>
  );
};

export default iso27001Management;
