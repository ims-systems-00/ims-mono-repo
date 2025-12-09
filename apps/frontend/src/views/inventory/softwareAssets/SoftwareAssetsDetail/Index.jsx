import React from "react";
import { SoftwareAssetsContextProvider } from "../store";
import SoftwareAssetDetail from "./SoftwareAssetDetail";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

const Index = (props) => {
  return (
    <SoftwareAssetsContextProvider {...props}>
      <TagsAndCategoriesContextProvider applicableModules={"softwareassets"}>
        <SoftwareAssetDetail {...props} />
      </TagsAndCategoriesContextProvider>
    </SoftwareAssetsContextProvider>
  );
};

export default Index;
