import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import React from "react";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Analytics from "../Overview/Analytics";
import LOADER from "./actions";
import { useISO27001_Annex_A } from "./store";
import Iso27001_2022AnnexAFilter from "./Iso27001_2022Filter";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import Box from "@/components/Box/Index";
import ComplianceToolDataTable from "../ComplianceToolDataTable";
import summaries from "../Summaries";
import useAccess from "@/hooks/useAccess";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";

const Iso27001_2022AnnexACompliance = (props) => {
  let {
    processing,
    iso27001_Annex_AControls,
    iso27001_Annex_AOverview,
    Iso27001_Annex_AQueryTools,
    updateDataTable,
  } = useISO27001_Annex_A();

  let { authUser } = useAccess();

  return (
    <React.Fragment>
      <div className="content bg-white">
        <h4 className="fw-semibold">
          {IMS_SERVICES.ISO27001_2022_ANNEX_A} ((2022 Annex A))
        </h4>
        <div className="mt-4">
          {
            summaries.find(
              (s) => s.toolKit === IMS_SERVICES.ISO27001_2022_ANNEX_A
            ).summary
          }
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
                    hasError={
                      processing[LOADER.LOAD_OVERVIEW_27001_ANNEX_A].error
                    }
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    {processing[LOADER.LOAD_OVERVIEW_27001_ANNEX_A].status ? (
                      <Loading />
                    ) : (
                      <Analytics
                        toolKit={IMS_SERVICES.ISO27001_2022_ANNEX_A}
                        overview={iso27001_Annex_AOverview}
                      />
                    )}
                  </ErrorHandlerComponent>
                </Box>
              </div>
            ),
          },
          {
            id: "iso27001AnnexA",
            text: "ISO 27001 (2022 Annex A)",
            icon: <i className="ims-icons-20 icon-icon-document-24 me-1"></i>,
            component: (
              <div className="content">
                <Box>
                  <ErrorHandlerComponent
                    hasError={
                      processing[LOADER.LOAD_COMPLIANCE_27001_ANNEX_A].error
                    }
                    errorMessage="This iso tool has been deleted or removed"
                  >
                    <SearchableDocument
                      moduleTypes={["compliancecontrols"]}
                      complianceTools={["ISO 27001 (2022 Annex A)"]}
                    />
                    <ComplianceToolDataTable
                      toolkit="ISO 27001 Annex A (Information Security Management System)"
                      dataTable={iso27001_Annex_AControls}
                      updateDataTable={updateDataTable}
                      processing={
                        processing[LOADER.LOAD_COMPLIANCE_27001_ANNEX_A]
                      }
                      pagination={Iso27001_Annex_AQueryTools}
                      filterToolbar={<Iso27001_2022AnnexAFilter />}
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
                          complianceTools={["ISO 27001 (2022 Annex A)"]}
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

export default Iso27001_2022AnnexACompliance;
