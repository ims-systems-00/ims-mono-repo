import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import React from "react";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Analytics from "../Overview/Analytics";
import LOADER from "./actions";
import { useISO15686 } from "./store";
import Iso15686Filter from "./Iso15686Filter";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import Box from "@/components/Box/Index";
import ComplianceToolDataTable from "../ComplianceToolDataTable";
import summaries from "../Summaries";
import useAccess from "@/hooks/useAccess";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";

const Iso15686 = ({ pathname }) => {
  let {
    processing,
    iso15686Controls,
    iso15686Overview,
    updateDataTable,
    Iso15686QueryTools,
  } = useISO15686();

  let { authUser } = useAccess();

  return (
    <>
      <div className="content bg-white">
        <h4 className="fw-semibold">{IMS_SERVICES.ISO15686_5} (2017)</h4>
        <div className="mt-4">
          {summaries.find((s) => s.toolKit === IMS_SERVICES.ISO15686_5).summary}
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
                    hasError={processing[LOADER.LOAD_OVERVIEW_15686].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    {processing[LOADER.LOAD_OVERVIEW_15686].status ? (
                      <Loading />
                    ) : (
                      <Analytics overview={iso15686Overview} />
                    )}
                  </ErrorHandlerComponent>
                </Box>
              </div>
            ),
          },
          {
            id: "iso15686",
            text: "ISO 15686-5 (2017)",
            icon: <i className="ims-icons-20 icon-icon-document-24 me-1"></i>,
            component: (
              <div className="content">
                <Box>
                  <ErrorHandlerComponent
                    hasError={processing[LOADER.LOAD_COMPLIANCE_15686].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    <SearchableDocument
                      moduleTypes={["compliancecontrols"]}
                      complianceTools={["ISO 15686-5"]}
                    />
                    <ComplianceToolDataTable
                      toolkit="ISO 15686-5 (Life-cycle costing-2017)"
                      dataTable={iso15686Controls}
                      processing={processing[LOADER.LOAD_COMPLIANCE_15686]}
                      updateDataTable={updateDataTable}
                      queryHandlers={Iso15686QueryTools}
                      filterToolbar={<Iso15686Filter />}
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
                          complianceTools={["ISO 15686-5"]}
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

/**
 * filter dynamic place holder (Seclect section)
 */

export default Iso15686;
