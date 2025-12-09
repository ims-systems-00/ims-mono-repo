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
  let [iso27001Controls, setIso27001Controls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW, status: true },
    { action: LOADER.LOAD_COMPLIANCE, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [iso27001Overview, setIso27001Overview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let Iso27001QueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ISO27001 } },
  });

  const fetchIso27001Controls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE]: { status: true, error: false, id: null },
      });
      let { data } = await getCompliance({
        query: `${qstr}`,
      });
      setIso27001Controls(data.compliance);
      Iso27001QueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE]: { status: false, error: true, id: null },
      });
      imsLogger("Iso27001", ex);
    }
  };

  const fetchIso27001Overview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW]: { status: true, error: false, id: null },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ISO27001),
        getCompliance({
          query: `name=${IMS_SERVICES.ISO27001}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setIso27001Overview({
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
      imsLogger("Iso27001", ex);
    }
  };

  let updateDataTable = () => {
    fetchIso27001Overview();
    fetchIso27001Controls(Iso27001QueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetchIso27001Overview();
      await fetchIso27001Controls(Iso27001QueryTools.getQuery());
      closeModalFilter();
    })();
  }, [Iso27001QueryTools.query]);

  return {
    processing,
    iso27001Controls,
    setIso27001Controls,
    iso27001Overview,
    Iso27001QueryTools,
    fetchIso27001Controls,
    updateDataTable,
    modalFilter,
    toggleModalFilter,
  };
}
