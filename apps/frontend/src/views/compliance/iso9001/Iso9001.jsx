import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import React from "react";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Analytics from "../Overview/Analytics";
import LOADER from "./actions";
import { useISO9001 } from "./store";
import Iso9001Filter from "./Iso9001Filter";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import Box from "@/components/Box/Index";
import ComplianceToolDataTable from "../ComplianceToolDataTable";
import summaries from "../Summaries";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";
import useAccess from "@/hooks/useAccess";

const Iso9001Compliance = (props) => {
  let {
    processing,
    iso9001Controls,
    iso9001Overview,
    Iso9001QueryTools,
    updateDataTable,
  } = useISO9001();
  let { authUser } = useAccess();

  return (
    <>
      <div className="content bg-white">
        <h4 className="fw-semibold">{IMS_SERVICES.ISO9001} (2015)</h4>
        <div className="mt-4">
          {summaries.find((s) => s.toolKit === IMS_SERVICES.ISO9001).summary}
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
                    hasError={processing[LOADER.LOAD_OVERVIEW_9001].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    {processing[LOADER.LOAD_OVERVIEW_9001].status ? (
                      <Loading />
                    ) : (
                      <Analytics overview={iso9001Overview} />
                    )}
                  </ErrorHandlerComponent>
                </Box>
              </div>
            ),
          },
          {
            id: "iso9001",
            text: "ISO 9001 (2015)",
            icon: <i className="ims-icons-20 icon-icon-document-24 me-1"></i>,
            component: (
              <div className="content">
                <Box>
                  <ErrorHandlerComponent
                    hasError={processing[LOADER.LOAD_COMPLIANCE_9001].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    <SearchableDocument
                      moduleTypes={["compliancecontrols"]}
                      complianceTools={["ISO 9001"]}
                    />
                    <ComplianceToolDataTable
                      toolkit="ISO 9001 (Quality Management System-2015)"
                      dataTable={iso9001Controls}
                      processing={processing[LOADER.LOAD_COMPLIANCE_9001]}
                      updateDataTable={updateDataTable}
                      queryHandlers={Iso9001QueryTools}
                      filterToolbar={<Iso9001Filter />}
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
                          complianceTools={["ISO 9001"]}
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

export default Iso9001Compliance;
