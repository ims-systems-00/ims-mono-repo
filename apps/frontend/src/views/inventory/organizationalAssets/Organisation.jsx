import { useState } from "react";
import OrganisationTable from "./OrganisationTable";
import { OrganizationAssetsContextProvider } from "./store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

import NavigationTabs from "@/components/NavigationTabs";
import Index from "@/views/tagsAndCategoriesManager/Index";

const OrganizationAssets = (props) => {
  const [activeTab, setActiveTab] = useState("allInformation");
  return (
    <>
      <OrganizationAssetsContextProvider {...props}>
        <TagsAndCategoriesContextProvider
          applicableModules={"informationassets"}
        >
          <NavigationTabs
            activeTab={activeTab}
            navigations={[
              {
                id: "allInformation",
                text: "All Information",
                icon: (
                  <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                ),
                component: <OrganisationTable {...props} />,
              },
              {
                id: "informationCategories",
                text: "Information Categories",
                icon: <i className="ims-icons-20 icon-icon-tag-24 me-1"></i>,
                component: <Index applicableModules="informationassets" />,
              },
            ]}
          />
        </TagsAndCategoriesContextProvider>
      </OrganizationAssetsContextProvider>
    </>
  );
};

export default OrganizationAssets;
