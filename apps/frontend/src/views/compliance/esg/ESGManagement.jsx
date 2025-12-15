import React from "react";
import { ESGContextProvider } from "./store";
import ESG from "./ESG";

const ESGManagement = (props) => {
  return (
    <ESGContextProvider {...props}>
      <ESG {...props} />
    </ESGContextProvider>
  );
};

export default ESGManagement;
