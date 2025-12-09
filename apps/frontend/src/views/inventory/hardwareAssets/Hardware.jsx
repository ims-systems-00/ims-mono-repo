import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import HardwareTable from "./HardwareTable";
import NavigationTabs from "@/components/NavigationTabs";
import Index from "@/views/tagsAndCategoriesManager/Index";

import { HardwareAssetsContextProvider } from "./store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

const HardwareAssets = (props) => {
  return (
    <>
      <DrawerContextProvider>
        <HardwareAssetsContextProvider {...props}>
          <TagsAndCategoriesContextProvider
            applicableModules={"hardwareassets"}
          >
            <NavigationTabs
              activeTab="allHardware"
              navigations={[
                {
                  id: "allHardware",
                  text: "All Hardware",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  ),
                  component: <HardwareTable {...props} />,
                },
                {
                  id: "hardwareCategories",
                  text: "Hardware Categories",
                  icon: <i className="ims-icons-20 icon-icon-tag-24 me-1"></i>,
                  component: <Index applicableModules="hardwareassets" />,
                },
              ]}
            />
          </TagsAndCategoriesContextProvider>
        </HardwareAssetsContextProvider>
      </DrawerContextProvider>
    </>
  );
};

export default HardwareAssets;
