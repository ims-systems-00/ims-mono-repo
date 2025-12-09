import useProcessingControl from "@/hooks/useProcessingControl";
import LOADER from "../actions";
import React from "react";
import useQuery from "@/hooks/useQuery";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { getCompliance } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import { mapToISOOverview } from "@/services/complianceToolsServices";

export default function useStore(config) {
  let [bs9997Controls, setBs9997Controls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_BS9997, status: true },
    { action: LOADER.LOAD_COMPLIANCE_BS9997, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [bs9997Overview, setBs9997Overview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let BS9997QueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.BS9997 } },
  });

  const fetchBS9997ToolControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_BS9997]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: `${qstr}`,
      });
      setBs9997Controls(data.compliance);
      BS9997QueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_BS9997]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_BS9997]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const fetchBS9997Overview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_BS9997]: { status: true, error: false, id: null },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.BS9997),
        getCompliance({
          query: `name=${IMS_SERVICES.BS9997}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setBs9997Overview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_OVERVIEW_BS9997]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_BS9997]: { status: false, error: true, id: null },
      });
      imsLogger("bs9997", ex);
    }
  };

  let updateDataTable = () => {
    fetchBS9997Overview();
    fetchBS9997ToolControls(BS9997QueryTools.getQuery());
  };
  React.useEffect(() => {
    (async function () {
      await fetchBS9997ToolControls(BS9997QueryTools.getQuery());
      fetchBS9997Overview();
      closeModalFilter();
    })();
  }, [BS9997QueryTools.query]);

  return {
    processing,
    bs9997Controls,
    setBs9997Controls,
    bs9997Overview,
    updateDataTable,
    BS9997QueryTools,
    fetchBS9997ToolControls,
    modalFilter,
    toggleModalFilter,
  };
}
