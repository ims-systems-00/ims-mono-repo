import React from "react";
import LOADER from "../actions";
import useProcessingControl from "@/hooks/useProcessingControl";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import useQuery from "@/hooks/useQuery";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { getCompliance } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";

export default function useStore(config) {
  let [iso9001Controls, setIso9001Controls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_9001, status: true },
    { action: LOADER.LOAD_COMPLIANCE_9001, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [iso9001Overview, setIso9001Overview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let Iso9001QueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ISO9001 } },
  });

  const fetchIso9001ToolControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_9001]: { status: true, error: false, id: null },
      });
      let { data } = await getCompliance({
        query: qstr,
      });
      setIso9001Controls(data.compliance);
      Iso9001QueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_9001]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_9001]: { status: false, error: true, id: null },
      });
      imsLogger("ISO9001", ex);
    }
  };

  const fetchIso9001Overview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_9001]: { status: true, error: false, id: null },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ISO9001),
        getCompliance({
          query: `name=${IMS_SERVICES.ISO9001}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setIso9001Overview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_OVERVIEW_9001]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_9001]: { status: false, error: true, id: null },
      });
      imsLogger("Iso9001", ex);
    }
  };
  let updateDataTable = () => {
    fetchIso9001Overview();
    fetchIso9001ToolControls(Iso9001QueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      await fetchIso9001ToolControls(Iso9001QueryTools.getQuery());
      fetchIso9001Overview();
      closeModalFilter();
    })();
  }, [Iso9001QueryTools.query]);

  return {
    processing,
    iso9001Controls,
    setIso9001Controls,
    iso9001Overview,
    Iso9001QueryTools,
    updateDataTable,
    fetchIso9001ToolControls,
    modalFilter,
    toggleModalFilter,
  };
}
