import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import React from "react";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Analytics from "../Overview/Analytics";
import LOADER from "./actions";
import { useISO45001 } from "./store";
import Iso45001Filter from "./Iso45001Filter";

import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import Box from "@/components/Box/Index";
import ComplianceToolDataTable from "../ComplianceToolDataTable";
import summaries from "../Summaries";
import useAccess from "@/hooks/useAccess";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";

const Iso45001 = (props) => {
  let {
    processing,
    iso45001Controls,
    iso45001Overview,
    Iso45001QueryTools,
    updateDataTable,
  } = useISO45001();

  let { authUser } = useAccess();

  return (
    <React.Fragment>
      <div className="content bg-white">
        <h4 className="fw-semibold">{IMS_SERVICES.ISO45001} (2018)</h4>
        <div className="mt-4">
          {summaries.find((s) => s.toolKit === IMS_SERVICES.ISO45001).summary}
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
                    hasError={processing[LOADER.LOAD_OVERVIEW_45001].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    {processing[LOADER.LOAD_OVERVIEW_45001].status ? (
                      <Loading />
                    ) : (
                      <Analytics overview={iso45001Overview} />
                    )}
                  </ErrorHandlerComponent>
                </Box>
              </div>
            ),
          },
          {
            id: "iso45001",
            text: "ISO 45001 (2018)",
            icon: <i className="ims-icons-20 icon-icon-document-24 me-1"></i>,
            component: (
              <div className="content">
                <Box>
                  <ErrorHandlerComponent
                    hasError={processing[LOADER.LOAD_COMPLIANCE_45001].error}
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    <SearchableDocument
                      moduleTypes={["compliancecontrols"]}
                      complianceTools={["ISO 45001"]}
                    />
                    <ComplianceToolDataTable
                      toolkit="ISO 45001 (Occupational Health and Safety Management System - 2018)"
                      dataTable={iso45001Controls}
                      processing={processing[LOADER.LOAD_COMPLIANCE_45001]}
                      updateDataTable={updateDataTable}
                      queryHandlers={Iso45001QueryTools}
                      filterToolbar={<Iso45001Filter />}
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
                          complianceTools={["ISO 45001"]}
                        />
                      </Box>
                    </ContentWrapper>
                  ),
                },
              ]
            : []),
        ]}
      />
    </React.Fragment>
  );
};

export default Iso45001;
