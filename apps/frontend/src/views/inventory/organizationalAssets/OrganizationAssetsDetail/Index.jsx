import React from "react";
import { OrganizationAssetsContextProvider } from "../store";
import OrganisationAssetDetail from "./OrganisationAssetDetail";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

const Index = (props) => {
  return (
    <React.Fragment>
      <OrganizationAssetsContextProvider {...props}>
        <TagsAndCategoriesContextProvider
          applicableModules={"informationassets"}
        >
          <OrganisationAssetDetail {...props} />
        </TagsAndCategoriesContextProvider>
      </OrganizationAssetsContextProvider>
    </React.Fragment>
  );
};

export default Index;
