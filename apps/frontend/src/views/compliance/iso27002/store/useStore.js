import useProcessingControl from "@/hooks/useProcessingControl";
import React from "react";
import LOADER from "../actions";
import useQuery from "@/hooks/useQuery";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { imsLogger } from "@/services/loggerService";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import { getCompliance } from "@/services/complianceToolsServices";

export default function useStore(config) {
  let [iso27002Controls, setIso27002Controls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_27002, status: true },
    { action: LOADER.LOAD_COMPLIANCE_27002, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [iso27002Overview, setIso27002Overview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let Iso27002QueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ISO27002 } },
  });
  const fetchIso27002ToolControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_27002]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: qstr,
      });
      setIso27002Controls(data.compliance);
      Iso27002QueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_27002]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_27002]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Iso27002", ex);
    }
  };

  const fetchIso27002Overview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_27002]: { status: true, error: false, id: null },
      });
      let { data } = await getComplianceOverview(IMS_SERVICES.ISO27002);
      let mapedData = mapToISOOverview(data.overview);
      setIso27002Overview({ overall: mapedData });
      dispatch({
        [LOADER.LOAD_OVERVIEW_27002]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_27002]: { status: false, error: true, id: null },
      });
      imsLogger("Iso27002", ex);
    }
  };

  let updateDataTable = () => {
    fetchIso27002Overview();
    fetchIso27002ToolControls(Iso27002QueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetchIso27002Overview();
      await fetchIso27002ToolControls(Iso27002QueryTools.getQuery());
      closeModalFilter();
    })();
  }, [Iso27002QueryTools.query]);

  return {
    processing,
    iso27002Controls,
    setIso27002Controls,
    iso27002Overview,
    Iso27002QueryTools,
    updateDataTable,
    fetchIso27002ToolControls,
    modalFilter,
    toggleModalFilter,
  };
}
