import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import PremisesTable from "./PremisesTable";
import { PremiseAssetsContextProvider } from "./store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

import NavigationTabs from "@/components/NavigationTabs";
import Index from "@/views/tagsAndCategoriesManager/Index";

const PremiseAssets = (props) => {
  return (
    <>
      <DrawerContextProvider>
        <PremiseAssetsContextProvider {...props}>
          <TagsAndCategoriesContextProvider applicableModules={"premiseassets"}>
            <NavigationTabs
              activeTab="allPremise"
              navigations={[
                {
                  id: "allPremise",
                  text: "All Premise",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  ),
                  component: <PremisesTable {...props} />,
                },
                {
                  id: "premiseCategories",
                  text: "Premise Categories",
                  icon: <i className="ims-icons-20 icon-icon-tag-24 me-1"></i>,
                  component: <Index applicableModules="premiseassets" />,
                },
              ]}
            />
          </TagsAndCategoriesContextProvider>
        </PremiseAssetsContextProvider>
      </DrawerContextProvider>
    </>
  );
};

export default PremiseAssets;
