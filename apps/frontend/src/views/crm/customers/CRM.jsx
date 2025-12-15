import React from "react";
import { TaskContextProvider } from "@/views/taskManagement/store";
import CRMTable from "./CRMTable";
import { CRMContextProvider } from "./store";
import NavigationTabs from "@/components/NavigationTabs";
import Index from "@/views/tagsAndCategoriesManager/Index";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";

const CRM = (props) => {
  return (
    <CRMContextProvider {...props}>
      <TaskContextProvider>
        <TagsAndCategoriesContextProvider applicableModules={"customers"}>
          <NavigationTabs
            activeTab="allCustomers"
            navigations={[
              {
                id: "allCustomers",
                text: "All Customers",
                icon: (
                  <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                ),
                component: <CRMTable {...props} />,
              },
              {
                id: "customersCategories",
                text: "Customers Categories",
                icon: <i className="ims-icons-20 icon-icon-tag-24 me-1"></i>,
                component: <Index applicableModules="customers" />,
              },
            ]}
          />
        </TagsAndCategoriesContextProvider>
      </TaskContextProvider>
    </CRMContextProvider>
  );
};

export default CRM;
