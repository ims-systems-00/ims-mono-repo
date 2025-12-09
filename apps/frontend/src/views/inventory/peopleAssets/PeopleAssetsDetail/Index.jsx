import React from "react";
import { PeopleAssetsContextProvider } from "../store";
import PeopleAssetDetail from "./PeopleAssetDetail";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

const Index = (props) => {
  return (
    <PeopleAssetsContextProvider {...props}>
      <TagsAndCategoriesContextProvider applicableModules={"peopleassets"}>
        <PeopleAssetDetail {...props} />
      </TagsAndCategoriesContextProvider>
    </PeopleAssetsContextProvider>
  );
};

export default Index;
