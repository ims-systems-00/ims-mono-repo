import { IMS_SERVICES } from "@/rolesAndPermissions";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { getCompliance } from "@/services/complianceToolsServices";
import LOADER from "../actions";
import React from "react";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import useQuery from "@/hooks/useQuery";
import useProcessingControl from "@/hooks/useProcessingControl";

export default function useStore(config) {
  let [iso27001_2022Controls, setIso27001_2022Controls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_27001_2022, status: true },
    { action: LOADER.LOAD_COMPLIANCE_27001_2022, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [iso27001_2022Overview, setIso27001_2022Overview] = React.useState({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let Iso27001_2022QueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ISO27001_2022 } },
  });
  const fetchIso27001_2022Controls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_27001_2022]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: `${qstr}`,
      });
      setIso27001_2022Controls(data.compliance);
      Iso27001_2022QueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_27001_2022]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_27001_2022]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Iso27001 2022", ex);
    }
  };

  const fetchIso27001_2022Overview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_27001_2022]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ISO27001_2022),
        getCompliance({
          query: `name=${IMS_SERVICES.ISO27001_2022}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setIso27001_2022Overview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_OVERVIEW_27001_2022]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_27001_2022]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Iso27001", ex);
    }
  };

  let updateDataTable = () => {
    fetchIso27001_2022Overview();
    fetchIso27001_2022Controls(Iso27001_2022QueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetchIso27001_2022Overview();
      await fetchIso27001_2022Controls(Iso27001_2022QueryTools.getQuery());
      closeModalFilter();
    })();
  }, [Iso27001_2022QueryTools.query]);

  return {
    processing,
    iso27001_2022Controls,
    setIso27001_2022Controls,
    iso27001_2022Overview,
    Iso27001_2022QueryTools,
    fetchIso27001_2022Controls,
    updateDataTable,
    modalFilter,
    toggleModalFilter,
  };
}
