import useProcessingControl from "@/hooks/useProcessingControl";
import LOADER from "../actions";
import React from "react";
import useQuery from "@/hooks/useQuery";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { getCompliance } from "@/services/complianceToolsServices";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";

export default function useStore(config) {
  let [iso20000Controls, setIso20000Controls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_20000, status: true },
    { action: LOADER.LOAD_COMPLIANCE_20000, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [iso20000Overview, setIso20000Overview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let Iso20000QueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ISO20000 } },
  });
  const fetchIso20000ToolControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_20000]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: qstr,
      });
      setIso20000Controls(data.compliance);
      Iso20000QueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_20000]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_20000]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Iso20000", ex);
    }
  };

  const fetchIso20000Overview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_20000]: { status: true, error: false, id: null },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ISO20000),
        getCompliance({
          query: `name=${IMS_SERVICES.ISO20000}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setIso20000Overview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_OVERVIEW_20000]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_20000]: { status: false, error: true, id: null },
      });
      imsLogger("Iso20000", ex);
    }
  };

  let updateDataTable = () => {
    fetchIso20000Overview();
    fetchIso20000ToolControls(Iso20000QueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetchIso20000Overview();
      await fetchIso20000ToolControls(Iso20000QueryTools.getQuery());
      closeModalFilter();
    })();
  }, [Iso20000QueryTools.query]);

  return {
    processing,
    iso20000Controls,
    setIso20000Controls,
    iso20000Overview,
    fetchIso20000ToolControls,
    updateDataTable,
    Iso20000QueryTools,
    modalFilter,
    toggleModalFilter,
  };
}
