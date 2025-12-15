import SoftwareTable from "./SoftwareTable";
import { SoftwareAssetsContextProvider } from "./store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";
import NavigationTabs from "@/components/NavigationTabs";
import Index from "@/views/tagsAndCategoriesManager/Index";

const SoftwareAsset = (props) => {
  return (
    <>
      <SoftwareAssetsContextProvider {...props}>
        <TagsAndCategoriesContextProvider applicableModules={"softwareassets"}>
          <NavigationTabs
            activeTab="allSoftware"
            navigations={[
              {
                id: "allSoftware",
                text: "All Software",
                icon: (
                  <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                ),
                component: <SoftwareTable {...props} />,
              },
              {
                id: "softwareCategories",
                text: "Software Categories",
                icon: <i className="ims-icons-20 icon-icon-tag-24 me-1"></i>,
                component: <Index applicableModules="softwareassets" />,
              },
            ]}
          />
        </TagsAndCategoriesContextProvider>
      </SoftwareAssetsContextProvider>
    </>
  );
};

export default SoftwareAsset;
