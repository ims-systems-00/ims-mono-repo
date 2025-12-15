import React from "react";
import { OrganisationContextProvider } from "./store";
import Organisation from "./Organisation";

const Index = () => {
  return (
    <OrganisationContextProvider>
      <Organisation />
    </OrganisationContextProvider>
  );
};

export default Index;
