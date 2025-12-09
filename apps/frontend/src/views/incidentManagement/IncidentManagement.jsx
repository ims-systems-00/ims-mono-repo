import { IncidentContextProvider } from "./store";
import IncidentsTable from "./IncidentsTable";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";
import NavigationTabs from "@/components/NavigationTabs";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import useAccess from "@/hooks/useAccess";
import Index from "@/views/tagsAndCategoriesManager/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Box from "@/components/Box/Index";

const IncidentManagement = ({
  moduleType = ["incidents", "audits"],
  moduleId = null,
  ...props
}) => {
  let { authUser } = useAccess();
  return (
    <DrawerContextProvider>
      <IncidentContextProvider
        moduleType={moduleType}
        moduleId={moduleId}
        {...props}
      >
        <TaskContextProvider>
          <TagsAndCategoriesContextProvider applicableModules={"incidents"}>
            <NavigationTabs
              activeTab="allIncidents"
              navigations={[
                {
                  id: "allIncidents",
                  text: "All Incidents",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  ),
                  component: <IncidentsTable />,
                },
                {
                  id: "incidentCategories",
                  text: "Incident Categories",
                  icon: <i className="ims-icons-20 icon-icon-tag-24 me-1"></i>,
                  component: <Index applicableModules="incidents" />,
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
                        icon: (
                          <i class="ims-icons-20 icon-icon-book-24 me-1"></i>
                        ),
                        component: (
                          <ContentWrapper>
                            <Box>
                              <TabSearchableDocument
                                moduleTypes={["incidents"]}
                              />
                            </Box>
                          </ContentWrapper>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </TagsAndCategoriesContextProvider>
        </TaskContextProvider>
      </IncidentContextProvider>
    </DrawerContextProvider>
  );
};

export default IncidentManagement;
