import SupplierManagementTable from "./SupplierManagementTable";
import { SupplierContextProvider } from "./store";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";
import NavigationTabs from "@/components/NavigationTabs";
import useAccess from "@/hooks/useAccess";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Box from "@/components/Box/Index";

const SupplierManagement = (props) => {
  let { authUser } = useAccess();

  return (
    <SupplierContextProvider {...props}>
      <TaskContextProvider>
        <NavigationTabs
          activeTab="allSuppliers"
          navigations={[
            {
              id: "allSuppliers",
              text: "All Suppliers",
              icon: <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>,
              component: <SupplierManagementTable {...props} />,
            },

            ...(authUser({
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              action: ACTIONS.READ,
              effect: EFFECTS.ALLOW,
            })
              ? [
                  {
                    id: "relatedSuppliers",
                    text: "Related Documents",
                    icon: <i class="ims-icons-20 icon-icon-book-24 me-1"></i>,
                    component: (
                      <ContentWrapper>
                        <Box>
                          <TabSearchableDocument moduleTypes={["suppliers"]} />
                        </Box>
                      </ContentWrapper>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </TaskContextProvider>
    </SupplierContextProvider>
  );
};

export default SupplierManagement;
