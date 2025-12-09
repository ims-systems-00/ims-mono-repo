import Loading from "@/components/Loader/Loading";
import useAccess from "@/hooks/useAccess";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getKpiObjectives } from "@/services/kpiObjectiveServices";
import { imsLogger } from "@/services/loggerService";
import { getCurrentUserInfo } from "@/services/userServices";
import KpiObjectiveActionsContextProvider from "./contexts/KpiObjectiveActionsContext";
import KpiObjectiveByBusinessFunctions from "./KpiObjectiveByBusinessFunctions";
import KpiObjectiveByOrganisation from "./KpiObjectiveByOrganisation";
import KpiObjectiveForm from "./KpiObjectiveForm";
import Box from "@/components/Box/Index";
import NavigationTabs from "@/components/NavigationTabs";

const KpiObjectives = (props) => {
  const currentUser = getCurrentUserInfo();
  const { authUser } = useAccess(currentUser);
  let [processing, setProcessing] = useState({ action: "load-kpi", id: null });
  let [kpiObjectives, setKpiObjectives] = useState([]);
  let addToExisting = (kpiObjective) =>
    setKpiObjectives((prevKpis) => [kpiObjective, ...prevKpis]);
  let updateKpiInList = (kpiObjective) =>
    setKpiObjectives((prevKpis) =>
      prevKpis.map((kpi) => (kpi._id === kpiObjective._id ? kpiObjective : kpi))
    );
  let deleteFromList = (kpiObjective) =>
    setKpiObjectives((prevKpis) =>
      prevKpis.filter((kpi) => kpi._id !== kpiObjective._id)
    );

  React.useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getKpiObjectives();
        setKpiObjectives(data.kpiObjectives);
      } catch (ex) {
        imsLogger("KpiObjectives", ex, ex.response);
      }
      setProcessing({ action: null, id: null });
    }
    fetchData();
  }, []);
  return (
    <React.Fragment>
      <KpiObjectiveActionsContextProvider
        value={{
          setProcessing,
          processing,
          addToExisting,
          updateKpiInList,
          deleteFromList,
        }}
      >
        <NavigationTabs
          activeTab="organisation"
          navigations={[
            ...(authUser({
              service: IMS_SERVICES.KPI_OBJECTIVE,
              action: ACTIONS.CREATE,
              effect: EFFECTS.ALLOW,
            })
              ? [
                  {
                    id: "addKpi",
                    text: "Add KPI",
                    icon: (
                      <i className="ims-icons-20 icon-icon-target-24 me-1"></i>
                    ),
                    component: (
                      <div className="content">
                        <Box>
                          <KpiObjectiveForm
                            processing={processing}
                            setProcessing={setProcessing}
                          />
                        </Box>
                      </div>
                    ),
                  },
                ]
              : []),
            {
              id: "businessUnits",
              text: "Business units",
              icon: (
                <i className="ims-icons-20 icon-icon-buildings-24 me-1"></i>
              ),
              component: (
                <div className="content">
                  <Box>
                    {processing.action === "load-kpi" ? (
                      <Loading />
                    ) : (
                      <KpiObjectiveByBusinessFunctions
                        kpiObjectives={kpiObjectives}
                        processing={processing}
                        setProcessing={setProcessing}
                      />
                    )}
                  </Box>
                </div>
              ),
            },
            {
              id: "organisation",
              text: "Organisation",
              icon: (
                <i className="ims-icons-20 icon-icon-snowflake-24 me-1"></i>
              ),
              component: (
                <div className="content">
                  <Box>
                    <KpiObjectiveByOrganisation kpiObjectives={kpiObjectives} />
                  </Box>
                </div>
              ),
            },
          ]}
        />
      </KpiObjectiveActionsContextProvider>
    </React.Fragment>
  );
};

export default KpiObjectives;
