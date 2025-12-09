import React from "react";
import { CRMContextProvider } from "../store";
import MyCustomerOverview from "./MyCustomerOverview";

const MyCRMOverviewIndex = () => {
  return (
    <CRMContextProvider>
      <div className="content">
        <MyCustomerOverview />
      </div>
    </CRMContextProvider>
  );
};

export default MyCRMOverviewIndex;
