import React from "react";
import { ISO15686ContextProvider } from "./store";
import Iso15686 from "./Iso15686";

const Iso15686Management = (props) => {
  return (
    <ISO15686ContextProvider {...props}>
      <Iso15686 {...props} />
    </ISO15686ContextProvider>
  );
};

export default Iso15686Management;
