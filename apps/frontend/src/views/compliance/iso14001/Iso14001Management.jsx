import React from "react";
import { ISO14001ContextProvider } from "./store";
import Iso14001 from "./Iso14001";

const Iso14001Management = (props) => {
  return (
    <ISO14001ContextProvider>
      <Iso14001 {...props} />
    </ISO14001ContextProvider>
  );
};

export default Iso14001Management;
