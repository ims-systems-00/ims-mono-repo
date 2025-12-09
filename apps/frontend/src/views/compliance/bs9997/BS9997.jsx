import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import React from "react";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Analytics from "../Overview/Analytics";
import LOADER from "./actions";
import { useBS9997 } from "./store";
import BS9997Filter from "./BS9997Filter";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import Box from "@/components/Box/Index";
import ComplianceToolDataTable from "../ComplianceToolDataTable";
import summaries from "../Summaries";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";
import useAccess from "@/hooks/useAccess";

const BS9997 = (props) => {
  let {
    processing,
    bs9997Controls,
    bs9997Overview,
    updateDataTable,
    BS9997QueryTools,
  } = useBS9997();

  let { authUser } = useAccess();

  return (
    <>
      <div className="content bg-white">
        <h4 className="fw-semibold">{IMS_SERVICES.BS9997} (2019)</h4>
        <div className="mt-4">
          {summaries.find((s) => s.toolKit === IMS_SERVICES.BS9997).summary}
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
                    hasError={processing[LOADER.LOAD_OVERVIEW_BS9997].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    {processing[LOADER.LOAD_OVERVIEW_BS9997].status ? (
                      <Loading />
                    ) : (
                      <Analytics overview={bs9997Overview} />
                    )}
                  </ErrorHandlerComponent>
                </Box>
              </div>
            ),
          },
          {
            id: "bs9997",
            text: "BS 9997 (2019)",
            icon: <i className="ims-icons-20 icon-icon-document-24 me-1"></i>,
            component: (
              <div className="content">
                <Box>
                  <ErrorHandlerComponent
                    hasError={processing[LOADER.LOAD_COMPLIANCE_BS9997].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    <SearchableDocument
                      moduleTypes={["compliancecontrols"]}
                      complianceTools={["BS 9997"]}
                    />
                    <ComplianceToolDataTable
                      toolkit="BS 9997 (Fire Risk Assessment System-2019)"
                      dataTable={bs9997Controls}
                      updateDataTable={updateDataTable}
                      processing={processing[LOADER.LOAD_COMPLIANCE_BS9997]}
                      queryHandlers={BS9997QueryTools}
                      filterToolbar={<BS9997Filter />}
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
                          complianceTools={["BS 9997"]}
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

export default BS9997;
