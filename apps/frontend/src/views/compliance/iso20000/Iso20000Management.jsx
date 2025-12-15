import React from "react";
import { ISO20000ContextProvider } from "./store";
import Iso20000 from "./Iso20000";

const Iso20000Management = (props) => {
  return (
    <ISO20000ContextProvider {...props}>
      <Iso20000 {...props} />
    </ISO20000ContextProvider>
  );
};

export default Iso20000Management;
