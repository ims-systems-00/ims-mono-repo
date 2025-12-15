import { TaskContextProvider } from "@/views/taskManagement/store";
import ContinualImprovementPlanTable from "./ContinualImprovementPlanTable";
import { CipContextProvider } from "./store";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";
import NavigationTabs from "@/components/NavigationTabs";
import useAccess from "@/hooks/useAccess";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Box from "@/components/Box/Index";

const CIP = (props) => {
  let { authUser } = useAccess();
  return (
    <CipContextProvider {...props}>
      <TaskContextProvider>
        <NavigationTabs
          activeTab="allOfi"
          navigations={[
            {
              id: "allOfi",
              text: "All OFI",
              icon: <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>,
              component: <ContinualImprovementPlanTable {...props} />,
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
                          <TabSearchableDocument moduleTypes={["cips"]} />
                        </Box>
                      </ContentWrapper>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </TaskContextProvider>
    </CipContextProvider>
  );
};

export default CIP;
