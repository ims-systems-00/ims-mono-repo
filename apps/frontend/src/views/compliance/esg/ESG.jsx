import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import {
  DrawerContextProvider,
  DrawerOpener,
  DrawerRight,
  UncontrolledAlert,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Link } from "react-router-dom";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import ESGGuidelines from "../ESGGuidelines";
import Analytics from "../Overview/Analytics";
import LOADER from "./actions";
import { useESG } from "./store";
import EnvironmentFilter from "./EnvironmentFilter";
import SocialFilter from "./SocialFilter";
import GovernanceFilter from "./GovernanceFilter";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import Box from "@/components/Box/Index";
import ComplianceToolDataTable from "../ComplianceToolDataTable";
import summaries from "../Summaries";

const ESG = () => {
  let {
    processing,
    environmentalOverview,
    socialOverview,
    governanceOverview,
    environmentalDataTable,
    socialDataTable,
    governanceDataTable,
    updateEnvironmentalDataTable,
    updateGovernanceDataTable,
    updateSocialDataTable,
    EnvironmentalQueryTools,
    SocialQueryTools,
    GovernanceQueryTools,
  } = useESG();

  return (
    <DrawerContextProvider>
      <React.Fragment>
        
        <NavigationTabs
          activeTab="overview"
          navigations={[
            {
              id: "overview",
              text: "Overview",
              component: (
                <div className="content">
                  <Box>
                    <ErrorHandlerComponent
                      hasError={
                        processing[LOADER.LOAD_ENVIRONMENTAL_OVERVIEW].error
                      }
                      errorMessage="This iso tool has been deleted or removed"
                    >
                      {processing[LOADER.LOAD_ENVIRONMENTAL_OVERVIEW].status ? (
                        <Loading />
                      ) : (
                        <div className="d-flex flex-column gap-4">
                          <Analytics
                            toolKit={IMS_SERVICES.ESG_ENVIRONMENTAL}
                            overview={environmentalOverview}
                            subcategory={"Environmental"}
                          />
                          <Analytics
                            toolKit={IMS_SERVICES.ESG_SOCIAL}
                            overview={socialOverview}
                            subcategory={"Social"}
                          />
                          <Analytics
                            toolKit={IMS_SERVICES.ESG_GOVERNANCE}
                            overview={governanceOverview}
                            subcategory={"Governance"}
                          />
                        </div>
                      )}
                    </ErrorHandlerComponent>
                  </Box>
                </div>
              ),
            },
            {
              id: "environmental",
              text: "Environmental",

              component: (
                <div className="content">
                  <Box>
                    <ErrorHandlerComponent
                      hasError={processing[LOADER.LOAD_ENVIRONMENTAL].error}
                      errorMessage="This toolkit has been deleted or removed"
                    >
                      <UncontrolledAlert color="primary">
                        Please review this guidelines and best practices to
                        manage this toolkit efficiently{" "}
                        <DrawerOpener drawerId="guideline-button">
                          <Link to="#" className=" py-0 alert-link">
                            Guidelines <i className="fa-solid fa-pen-nib" />
                          </Link>
                        </DrawerOpener>
                      </UncontrolledAlert>
                      <SearchableDocument
                        moduleTypes={["compliancecontrols"]}
                        complianceTools={["ESG Toolkit - Environmental"]}
                      />
                      <ComplianceToolDataTable
                        toolkit="Environmental & Social Governance"
                        dataTable={environmentalDataTable}
                        updateDataTable={updateEnvironmentalDataTable}
                        processing={processing[LOADER.LOAD_ENVIRONMENTAL]}
                        queryHandlers={EnvironmentalQueryTools}
                        filterToolbar={<EnvironmentFilter />}
                      />
                    </ErrorHandlerComponent>
                  </Box>
                </div>
              ),
            },
            {
              id: "social",
              text: "Social",
              component: (
                <div className="content">
                  <Box>
                    <ErrorHandlerComponent
                      hasError={processing[LOADER.LOAD_SOCIAL].error}
                      errorMessage="This toolkit has been deleted or removed"
                    >
                      <UncontrolledAlert color="primary">
                        Please review this guidelines and best practices to
                        manage this toolkit efficiently{" "}
                        <DrawerOpener drawerId="guideline-button">
                          <Link to="#" className=" py-0 alert-link">
                            Guidelines <i className="fa-solid fa-pen-nib" />
                          </Link>
                        </DrawerOpener>
                      </UncontrolledAlert>
                      <SearchableDocument
                        moduleTypes={["compliancecontrols"]}
                        complianceTools={["ESG Toolkit - Social"]}
                      />
                      <ComplianceToolDataTable
                        toolkit="Environmental & Social Governance"
                        dataTable={socialDataTable}
                        updateDataTable={updateSocialDataTable}
                        processing={processing[LOADER.LOAD_SOCIAL]}
                        queryHandlers={SocialQueryTools}
                        filterToolbar={<SocialFilter />}
                      />
                    </ErrorHandlerComponent>
                  </Box>
                </div>
              ),
            },
            {
              id: "governance",
              text: "Governance",
              icon: <i className="ims-icons-20 icon-icon-building-24 me-1"></i>,
              component: (
                <div className="content">
                  <Box>
                    <ErrorHandlerComponent
                      hasError={processing[LOADER.LOAD_GOVERNANCE].error}
                      errorMessage="This toolkit has been deleted or removed"
                    >
                      <UncontrolledAlert color="primary">
                        Please review this guidelines and best practices to
                        manage this toolkit efficiently{" "}
                        <DrawerOpener drawerId="guideline-button">
                          <Link to="#" className=" py-0 alert-link">
                            Guidelines <i className="fa-solid fa-pen-nib" />
                          </Link>
                        </DrawerOpener>
                      </UncontrolledAlert>
                      <SearchableDocument
                        moduleTypes={["compliancecontrols"]}
                        complianceTools={["ESG Toolkit - Governance"]}
                      />
                      <ComplianceToolDataTable
                        toolkit="Environmental & Social Governance"
                        dataTable={governanceDataTable}
                        updateDataTable={updateGovernanceDataTable}
                        processing={processing[LOADER.LOAD_GOVERNANCE]}
                        queryHandlers={GovernanceQueryTools}
                        filterToolbar={<GovernanceFilter />}
                      />
                    </ErrorHandlerComponent>
                  </Box>
                </div>
              ),
            },
          ]}
        />
        <DrawerRight drawerId="guideline-button">
          {<ESGGuidelines />}
        </DrawerRight>
      </React.Fragment>
    </DrawerContextProvider>
  );
};

export default ESG;
