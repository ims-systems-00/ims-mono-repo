import React from "react";
import { InvoiceContextProvider } from "../store";
import InvoiceDrawerDetail from "../InvoiceDrawerDetail";

const Index = (props) => {
  return (
    <InvoiceContextProvider {...props}>
      <InvoiceDrawerDetail />
    </InvoiceContextProvider>
  );
};

export default Index;
