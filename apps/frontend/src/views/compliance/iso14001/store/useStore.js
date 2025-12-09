import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import LOADER from "../actions";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import { getCompliance } from "@/services/complianceToolsServices";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";

export default function useStore(config) {
  let [iso14001Controls, setIso14001Controls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_14001, status: true },
    { action: LOADER.LOAD_COMPLIANCE_14001, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [iso14001Overview, setIso14001Overview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let Iso14001QueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ISO14001 } },
  });
  const fetchIso14001ToolControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_14001]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: `${qstr}`,
      });
      setIso14001Controls(data.compliance);
      Iso14001QueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_14001]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_14001]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Iso14001", ex);
    }
  };

  const fetchIso14001Overview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_14001]: { status: true, error: false, id: null },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ISO14001),
        getCompliance({
          query: `name=${IMS_SERVICES.ISO14001}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setIso14001Overview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_OVERVIEW_14001]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_14001]: { status: false, error: true, id: null },
      });
      imsLogger("Iso14001", ex);
    }
  };

  let updateDataTable = () => {
    fetchIso14001Overview();
    fetchIso14001ToolControls(Iso14001QueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      await fetchIso14001ToolControls(Iso14001QueryTools.getQuery());
      fetchIso14001Overview();
      closeModalFilter();
    })();
  }, [Iso14001QueryTools.query]);

  return {
    processing,
    Iso14001QueryTools,
    iso14001Controls,
    setIso14001Controls,
    iso14001Overview,
    updateDataTable,
    fetchIso14001ToolControls,
    modalFilter,
    toggleModalFilter,
  };
}
