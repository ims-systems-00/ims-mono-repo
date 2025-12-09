import React from "react";
import { HardwareAssetsContextProvider } from "../store";
import HardwareAssetDetail from "./HardwareAssetDetail";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

const Index = (props) => {
  return (
    <HardwareAssetsContextProvider {...props}>
      <TagsAndCategoriesContextProvider applicableModules={"hardwareassets"}>
        <HardwareAssetDetail />
      </TagsAndCategoriesContextProvider>
    </HardwareAssetsContextProvider>
  );
};

export default Index;
