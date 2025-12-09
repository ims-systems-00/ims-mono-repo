import { TaskContextProvider } from "@/views/taskManagement/store";
import ReviewTable from "./ReviewTable";
import { ScheduleContextProvider } from "./store";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";
import NavigationTabs from "@/components/NavigationTabs";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import useAccess from "@/hooks/useAccess";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Box from "@/components/Box/Index";

const ManagementReview = (props) => {
  let { authUser } = useAccess();
  return (
    <DrawerContextProvider>
      <ScheduleContextProvider {...props}>
        <TaskContextProvider>
          <NavigationTabs
            activeTab="allManagementReviews"
            navigations={[
              {
                id: "allManagementReviews",
                text: "All Management Reviews",
                icon: (
                  <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                ),
                component: <ReviewTable {...props} />,
              },
              ...(authUser({
                service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                action: ACTIONS.READ,
                effect: EFFECTS.ALLOW,
              })
                ? [
                    {
                      id: "relatedDocuments",
                      text: "Related Documents",
                      icon: <i class="ims-icons-20 icon-icon-book-24 me-1"></i>,
                      component: (
                        <ContentWrapper>
                          <Box>
                            <TabSearchableDocument
                              moduleTypes={["managementreviews"]}
                            />
                          </Box>
                        </ContentWrapper>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </TaskContextProvider>
      </ScheduleContextProvider>
    </DrawerContextProvider>
  );
};

export default ManagementReview;
