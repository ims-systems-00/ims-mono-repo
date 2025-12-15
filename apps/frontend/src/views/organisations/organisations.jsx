import NavigationTabs from "@/components/NavigationTabs";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Box from "@/components/Box/Index";

import useAccess from "@/hooks/useAccess";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";

import OrganisationContextProvider from "./store/OrganisationContextProvider";

import OrganisationTable from "./OrganisationsTable";

import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";

const Organisation = (props) => {
  const { authUser } = useAccess();

  return (
    <OrganisationContextProvider {...props}>
      <NavigationTabs
        activeTab="all-organisations"
        navigations={[
          {
            id: "all-organisations",
            text: "All Organisations",
            icon: <i className="ims-icons-20 icon-icon-building-24 me-1"></i>,
            component: <OrganisationTable {...props} />,
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
                  icon: <i className="ims-icons-20 icon-icon-book-24 me-1"></i>,
                  component: (
                    <ContentWrapper>
                      <Box>
                        <TabSearchableDocument moduleTypes={["organisation"]} />
                      </Box>
                    </ContentWrapper>
                  ),
                },
              ]
            : []),
        ]}
      />
    </OrganisationContextProvider>
  );
};

export default Organisation;
