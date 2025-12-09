import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import React from "react";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import ComplianceToolDataTable from "../ComplianceToolDataTable";
import Analytics from "../Overview/Analytics";
import { useISO27001 } from "./store";
import LOADER from "./actions";
import Box from "@/components/Box/Index";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import Iso27001Filter from "./Iso27001Filter";
import summaries from "../Summaries";
import useAccess from "@/hooks/useAccess";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";

const Iso27001Compliance = (props) => {
  let {
    processing,
    iso27001Controls,
    iso27001Overview,
    updateDataTable,
    Iso27001QueryTools,
  } = useISO27001();

  let { authUser } = useAccess();

  return (
    <>
      <div className="content bg-white">
        <h4 className="fw-semibold">{IMS_SERVICES.ISO27001} (2013)</h4>
        <div className="mt-4">
          {summaries.find((s) => s.toolKit === IMS_SERVICES.ISO27001).summary}
        </div>
      </div>
      <NavigationTabs
        activeTab="overview"
        navigations={[
          {
            id: "overview",
            text: "Overview",
            icon: <i className="ims-icons-20 icon-icon-chart-24 me-1"></i>,
            component: (
              <div className="content">
                <Box>
                  <ErrorHandlerComponent
                    hasError={processing[LOADER.LOAD_OVERVIEW].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    {processing[LOADER.LOAD_OVERVIEW].status ? (
                      <Loading />
                    ) : (
                      <Analytics overview={iso27001Overview} />
                    )}
                  </ErrorHandlerComponent>
                </Box>
              </div>
            ),
          },
          {
            id: "iso27001",
            text: "ISO 27001 (2013)",
            icon: <i className="ims-icons-20 icon-icon-document-24 me-1"></i>,
            component: (
              <div className="content">
                <Box>
                  <ErrorHandlerComponent
                    hasError={processing[LOADER.LOAD_COMPLIANCE].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    <SearchableDocument
                      moduleTypes={["compliancecontrols"]}
                      complianceTools={["ISO 27001"]}
                    />
                    <ComplianceToolDataTable
                      toolkit="ISO 27001 (Information Security Management System-2013)"
                      dataTable={iso27001Controls}
                      updateDataTable={updateDataTable}
                      processing={processing[LOADER.LOAD_COMPLIANCE]}
                      queryHandlers={Iso27001QueryTools}
                      filterToolbar={<Iso27001Filter />}
                    />
                  </ErrorHandlerComponent>
                </Box>
              </div>
            ),
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
                          moduleTypes={["compliancecontrols"]}
                          complianceTools={["ISO 27001"]}
                        />
                      </Box>
                    </ContentWrapper>
                  ),
                },
              ]
            : []),
        ]}
      />
    </>
  );
};

export default Iso27001Compliance;
