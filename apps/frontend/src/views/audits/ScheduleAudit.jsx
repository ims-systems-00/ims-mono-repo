import React from "react";
import { TaskContextProvider } from "@/views/taskManagement/store";
import AuditTable from "./AuditTable";
import { AuditContextProvider } from "./store";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import NavigationTabs from "@/components/NavigationTabs";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import useAccess from "@/hooks/useAccess";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Box from "@/components/Box/Index";

const Audits = (props) => {
  let { authUser } = useAccess();
  return (
    <DrawerContextProvider>
      <AuditContextProvider {...props}>
        <TaskContextProvider>
          <NavigationTabs
            activeTab="allAudits"
            navigations={[
              {
                id: "allAudits",
                text: "All Audits",
                icon: (
                  <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                ),
                component: <AuditTable {...props} />,
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
                            <TabSearchableDocument moduleTypes={["audits"]} />
                          </Box>
                        </ContentWrapper>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </TaskContextProvider>
      </AuditContextProvider>
    </DrawerContextProvider>
  );
};

export default Audits;
