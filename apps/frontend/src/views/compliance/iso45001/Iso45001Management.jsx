import React from "react";
import { ISO45001ContextProvider } from "./store";
import Iso45001 from "./Iso45001";

const Iso45001Management = (props) => {
  return (
    <ISO45001ContextProvider {...props}>
      <Iso45001 {...props} />
    </ISO45001ContextProvider>
  );
};

export default Iso45001Management;
