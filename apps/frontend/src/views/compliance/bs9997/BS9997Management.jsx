import React from "react";
import { BS9997ContextProvider } from "./store";
import BS9997 from "./BS9997";

const BS9997Management = (props) => {
  return (
    <BS9997ContextProvider {...props}>
      <BS9997 {...props} />
    </BS9997ContextProvider>
  );
};

export default BS9997Management;
