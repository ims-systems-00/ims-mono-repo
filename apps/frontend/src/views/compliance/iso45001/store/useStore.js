import { getComplianceOverview } from "@/services/complianceToolsServices";
import LOADER from "../actions";
import { getCompliance } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import React from "react";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";

export default function useStore(config) {
  let [iso45001Controls, setIso45001Controls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_45001, status: true },
    { action: LOADER.LOAD_COMPLIANCE_45001, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [iso45001Overview, setIso45001Overview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let Iso45001QueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ISO45001 } },
  });
  const fetchIso45001ToolControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_45001]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: qstr,
      });
      setIso45001Controls(data.compliance);
      Iso45001QueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_45001]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_45001]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ISO45001", ex);
    }
  };

  const fetchIso45001Overview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_45001]: { status: true, error: false, id: null },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ISO45001),
        getCompliance({
          query: `name=${IMS_SERVICES.ISO45001}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setIso45001Overview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_OVERVIEW_45001]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_45001]: { status: false, error: true, id: null },
      });
      imsLogger("Iso27001", ex);
    }
  };

  let updateDataTable = () => {
    fetchIso45001Overview();
    fetchIso45001ToolControls(Iso45001QueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetchIso45001Overview();
      await fetchIso45001ToolControls(Iso45001QueryTools.getQuery());
      closeModalFilter();
    })();
  }, [Iso45001QueryTools.query]);

  return {
    processing,
    iso45001Controls,
    setIso45001Controls,
    iso45001Overview,
    Iso45001QueryTools,
    fetchIso45001ToolControls,
    updateDataTable,
    modalFilter,
    toggleModalFilter,
  };
}
