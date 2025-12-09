import { IMS_SERVICES } from "@/rolesAndPermissions";
import LOADER from "../actions";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { getCompliance } from "@/services/complianceToolsServices";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import React from "react";
import useQuery from "@/hooks/useQuery";
import useProcessingControl from "@/hooks/useProcessingControl";

export default function useStore(config) {
  let [iso15686Controls, setIso15686Controls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_15686, status: true },
    { action: LOADER.LOAD_COMPLIANCE_15686, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [iso15686Overview, setIso15686Overview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };

  let Iso15686QueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ISO15686_5 } },
  });

  const fetchIso15686ToolControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_15686]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: qstr,
      });
      setIso15686Controls(data.compliance);
      Iso15686QueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_15686]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_15686]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ISO15686_5", ex);
    }
  };

  const fetchIso15686Overview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_15686]: { status: true, error: false, id: null },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ISO15686_5),
        getCompliance({
          query: `name=${IMS_SERVICES.ISO15686_5}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setIso15686Overview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_OVERVIEW_15686]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_15686]: { status: false, error: true, id: null },
      });
      imsLogger("ISO15686_5", ex);
    }
  };

  let updateDataTable = () => {
    fetchIso15686Overview();
    fetchIso15686ToolControls(Iso15686QueryTools.getQuery());
  };
  React.useEffect(() => {
    (async function () {
      await fetchIso15686ToolControls(Iso15686QueryTools.getQuery());
      fetchIso15686Overview();
      closeModalFilter();
    })();
  }, [Iso15686QueryTools.query]);

  return {
    processing,
    iso15686Controls,
    setIso15686Controls,
    iso15686Overview,
    Iso15686QueryTools,
    updateDataTable,
    fetchIso15686ToolControls,
    modalFilter,
    toggleModalFilter,
  };
}
