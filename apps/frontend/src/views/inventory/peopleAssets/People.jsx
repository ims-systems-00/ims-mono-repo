import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import PeopleTable from "./PeopleTable";
import { PeopleAssetsContextProvider } from "./store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

import NavigationTabs from "@/components/NavigationTabs";
import Index from "@/views/tagsAndCategoriesManager/Index";

const PeopleAsset = (props) => {
  return (
    <>
      <DrawerContextProvider>
        <PeopleAssetsContextProvider {...props}>
          <TagsAndCategoriesContextProvider applicableModules={"peopleassets"}>
            <NavigationTabs
              activeTab="allPeople"
              navigations={[
                {
                  id: "allPeople",
                  text: "All People",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  ),
                  component: <PeopleTable {...props} />,
                },
                {
                  id: "peopleCategories",
                  text: "People Categories",
                  icon: <i className="ims-icons-20 icon-icon-tag-24 me-1"></i>,
                  component: <Index applicableModules="peopleassets" />,
                },
              ]}
            />
            
          </TagsAndCategoriesContextProvider>
        </PeopleAssetsContextProvider>
      </DrawerContextProvider>
    </>
  );
};

export default PeopleAsset;
