import React from "react";
import { OrganisationContextProvider } from "./store";
import Organisation from "./Organisation";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Index = () => {
  return (
    <DrawerContextProvider>
      <OrganisationContextProvider>
        <Organisation />
      </OrganisationContextProvider>
    </DrawerContextProvider>
  );
};

export default Index;
