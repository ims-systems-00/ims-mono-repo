import React from "react";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { getCompliance } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import LOADER from "../actions";

export default function useStore(config) {
  let [buildingSafetyActControls, setBuildingSafetyActControls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW, status: true },
    { action: LOADER.LOAD_COMPLIANCE, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [buildingSafetyActOverview, setBuildingSafetyActOverview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let buildingSafetyActQueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.BUILDING_SAFETY_ACT } },
  });

  const fetchBuildingSafetyActControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE]: { status: true, error: false, id: null },
      });
      let { data } = await getCompliance({
        query: `${qstr}`,
      });
      setBuildingSafetyActControls(data.compliance);
      buildingSafetyActQueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE]: { status: false, error: true, id: null },
      });
      imsLogger("BuildingSafetyAct", ex);
    }
  };

  const fetchBuildingSafetyActOverview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW]: { status: true, error: false, id: null },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.BUILDING_SAFETY_ACT),
        getCompliance({
          query: `name=${IMS_SERVICES.BUILDING_SAFETY_ACT}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setBuildingSafetyActOverview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_OVERVIEW]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW]: { status: false, error: true, id: null },
      });
      imsLogger("BuildingSafetyAct", ex);
    }
  };

  let updateDataTable = () => {
    fetchBuildingSafetyActOverview();
    fetchBuildingSafetyActControls(buildingSafetyActQueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetchBuildingSafetyActOverview();
      await fetchBuildingSafetyActControls(buildingSafetyActQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [buildingSafetyActQueryTools.query]);

  return {
    processing,
    buildingSafetyActControls,
    setBuildingSafetyActControls,
    buildingSafetyActOverview,
    buildingSafetyActQueryTools,
    fetchBuildingSafetyActControls,
    updateDataTable,
    modalFilter,
    toggleModalFilter,
  };
}