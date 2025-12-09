import Loading from "@/components/Loader/Loading";
import React from "react";
import IncidentManagement from "@/views/incidentManagement/IncidentManagement";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import ContractsButtons from "./ContractsButtons";
import KpiObjective from "./KpiObjective";
import KpiObjectiveForm from "./KpiObjectiveForm";
import OnboardingsButtons from "./OnboardingsButtons";
import SlasButtons from "./SlasButtons";
import SupplierOverview from "./SupplierOverview";
import USER_ACTIONS from "./actions";
import { useSupplier } from "./store";
import NavigationTabs from "@/components/NavigationTabs";

const SupplierDrawerDetail = () => {
  let { processing, visitingSupplier: supplier, addKpi } = useSupplier();
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_SUPPLIER].status ? (
        <Loading />
      ) : (
        supplier && (
          <React.Fragment>
            <DetailsDrawerHeader data={supplier} />
            <NavigationTabs
              container={false}
              activeTab="overview"
              navigations={[
                {
                  id: "overview",
                  text: "Overview",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  ),
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mb-3">
                        <SupplierOverview />
                      </div>
                    </div>
                  ),
                },
                {
                  id: "details",
                  text: "Details",
                  icon: <i className="ims-icons-20 icon-icon-list-24 me-1"></i>,
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mb-3">
                        <DetailsWrapper
                          label={"Service provision:"}
                          iconClass={"tim-icons icon-pencil"}
                          value={supplier?.serviceProvision}
                          labelClass={"pr-2"}
                        />

                        {/* <Col md="12">
                      <DetailsSectionContent
                        label={"KPI/Objectives:"}
                        value={supplier.kpiObjectives.map((kpi, index) => (
                          <p className="text-secondary">
                            KPI-{index}. {kpi.value}
                          </p>
                        ))}
                      />
                    </Col> */}

                        {supplier?.contractFiles.length > 0 && (
                          <>
                            <DetailsWrapper
                              label={"Contracts:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={null}
                              labelClass={"pr-2"}
                            />
                            <Attachments s3Information={supplier.contractFiles}>
                              <ContractsButtons />
                            </Attachments>
                          </>
                        )}
                        {supplier?.slaFiles.length > 0 && (
                          <>
                            <DetailsWrapper
                              label={"SLAs:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={null}
                              labelClass={"pr-2"}
                            />
                            <Attachments s3Information={supplier.slaFiles}>
                              <SlasButtons />
                            </Attachments>
                          </>
                        )}
                        {supplier?.onBoardingFiles.length > 0 && (
                          <>
                            <DetailsWrapper
                              label={"Onboarding documents:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={null}
                              labelClass={"pr-2"}
                            />
                            <Attachments
                              s3Information={supplier.onBoardingFiles}
                            >
                              <OnboardingsButtons />
                            </Attachments>
                          </>
                        )}
                      </div>
                    </div>
                  ),
                },
                {
                  id: "kpiObjectives",
                  text: "KPI/Objectives",
                  icon: (
                    <i className="ims-icons-20 icon-icon-activity-24 me-1"></i>
                  ),
                  component: (
                    <div>
                      <KpiObjectiveForm
                        onSubmit={async (data) => {
                          await addKpi(data);
                        }}
                      />
                      {supplier.kpiObjectives.map((kpi) => (
                        <KpiObjective kpi={kpi} key={kpi._id} />
                      ))}
                    </div>
                  ),
                },
                {
                  id: "incidents",
                  text: "Incidents",
                  icon: (
                    <i className="ims-icons-20 icon-icon-circlewavywarning-24 me-1"></i>
                  ),
                  component: (
                    <IncidentManagement
                      moduleType="suppliers"
                      moduleId={supplier._id}
                    />
                  ),
                },
                {
                  id: "tasks",
                  text: "Tasks",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notepad-24 me-1"></i>
                  ),
                  component: (
                    <TaskManagement
                      moduleType="suppliers"
                      module={supplier._id}
                    />
                  ),
                },
              ]}
            />
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
};

export default SupplierDrawerDetail;
