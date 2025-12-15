import RiskTable from "./RiskTable";
import { RiskContextProvider } from "./store";
import { TaskContextProvider } from "@/views/taskManagement/store";
import { TagsAndCategoriesContextProvider } from "@/views/tagsAndCategoriesManager/store";
import NavigationTabs from "@/components/NavigationTabs";
import Index from "@/views/tagsAndCategoriesManager/Index";
import useAccess from "@/hooks/useAccess";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Box from "@/components/Box/Index";

const RiskManagement = (props) => {
  let { authUser } = useAccess();
  return (
    <RiskContextProvider {...props}>
      <TaskContextProvider>
        <TagsAndCategoriesContextProvider applicableModules={"risks"}>
          <NavigationTabs
            activeTab="allRisks"
            navigations={[
              {
                id: "allRisks",
                text: "All Risks",
                icon: (
                  <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                ),
                component: <RiskTable {...props} />,
              },
              {
                id: "riskCategories",
                text: "Risk Categories",
                icon: <i className="ims-icons-20 icon-icon-tag-24 me-1"></i>,
                component: <Index applicableModules="risks" />,
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
                            <TabSearchableDocument moduleTypes={["risks"]} />
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
    </RiskContextProvider>
  );
};

export default RiskManagement;
