import React from "react";
import { PremiseAssetsContextProvider } from "../store";
import PremisesDetail from "./PremisesDetails";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

const Index = (props) => {
  return (
    <React.Fragment>
      <PremiseAssetsContextProvider {...props}>
        <TagsAndCategoriesContextProvider applicableModules={"premiseassets"}>
          <PremisesDetail {...props} />
        </TagsAndCategoriesContextProvider>
      </PremiseAssetsContextProvider>
    </React.Fragment>
  );
};

export default Index;
