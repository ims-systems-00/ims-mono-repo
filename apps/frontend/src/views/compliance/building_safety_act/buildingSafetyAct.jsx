import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import React from "react";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import ComplianceToolDataTable from "../ComplianceToolDataTable";
import Analytics from "../Overview/Analytics";
import LOADER from "./actions";
import Box from "@/components/Box/Index";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import BuildingSafetyActFilter from "./buildingSafetyActFilter";
import summaries from "../Summaries";
import useAccess from "@/hooks/useAccess";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import { TabSearchableDocument } from "@/views/documentManagement/searchableList/components/Index";
import useBuildingSafetyAct from "./store/useBuildingSafetyAct";

const BuildingSafetyActCompliance = (props) => {
  let {
    processing,
    buildingSafetyActControls,
    buildingSafetyActOverview,
    updateDataTable,
    buildingSafetyActQueryTools,
  } = useBuildingSafetyAct();

  let { authUser } = useAccess();

  return (
    <>
      <div className="content bg-white">
        <h4 className="fw-semibold">{IMS_SERVICES.BUILDING_SAFETY_ACT}</h4>
        <div className="mt-4">
          {summaries.find((s) => s.toolKit === IMS_SERVICES.BUILDING_SAFETY_ACT)?.summary}
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
                    errorMessage="This building safety act tool has been deleted or removed"
                  >
                    {processing[LOADER.LOAD_OVERVIEW].status ? (
                      <Loading />
                    ) : (
                      <Analytics overview={buildingSafetyActOverview} />
                    )}
                  </ErrorHandlerComponent>
                </Box>
              </div>
            ),
          },
          {
            id: "buildingSafetyAct",
            text: "Building Safety Act",
            icon: <i className="ims-icons-20 icon-icon-document-24 me-1"></i>,
            component: (
              <div className="content">
                <Box>
                  <ErrorHandlerComponent
                    hasError={processing[LOADER.LOAD_COMPLIANCE].error}
                    errorMessage="This building safety act tool has been deleted or removed"
                  >
                    <SearchableDocument
                      moduleTypes={["compliancecontrols"]}
                      complianceTools={["Building Safety Act"]}
                    />
                    <ComplianceToolDataTable
                      toolkit="Building Safety Act"
                      dataTable={buildingSafetyActControls}
                      updateDataTable={updateDataTable}
                      processing={processing[LOADER.LOAD_COMPLIANCE]}
                      queryHandlers={buildingSafetyActQueryTools}
                      filterToolbar={<BuildingSafetyActFilter />}
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
                          complianceTools={["Building Safety Act"]}
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

export default BuildingSafetyActCompliance;