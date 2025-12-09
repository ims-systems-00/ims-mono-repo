import useProcessingControl from "@/hooks/useProcessingControl";
import React from "react";
import LOADER from "../actions";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { getCompliance } from "@/services/complianceToolsServices";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import useQuery from "@/hooks/useQuery";
import { imsLogger } from "@/services/loggerService";

export default function useStore(config) {
  let [iso27001_Annex_AControls, setIso27001_Annex_AControls] = React.useState(
    []
  );
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_27001_ANNEX_A, status: true },
    { action: LOADER.LOAD_COMPLIANCE_27001_ANNEX_A, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  let [iso27001_Annex_AOverview, setIso27001_Annex_AOverview] = React.useState(
    {}
  );
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let Iso27001_Annex_AQueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ISO27001_2022_ANNEX_A } },
  });

  const fetchISO_27001_Annex_AToolControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_27001_ANNEX_A]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: `${qstr}`,
      });
      setIso27001_Annex_AControls(data.compliance);
      Iso27001_Annex_AQueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_27001_ANNEX_A]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_27001_ANNEX_A]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Iso27001_Annex_A", ex);
    }
  };

  const fetch_Iso_27001_Annex_AOverview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_27001_ANNEX_A]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ISO27001_2022_ANNEX_A),
        getCompliance({
          query: `name=${IMS_SERVICES.ISO27001_2022_ANNEX_A}&page=1&size=20&parentClause=null`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setIso27001_Annex_AOverview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_OVERVIEW_27001_ANNEX_A]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_27001_ANNEX_A]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Iso27001_Annex_A", ex);
    }
  };

  let updateDataTable = () => {
    fetch_Iso_27001_Annex_AOverview();
    fetchISO_27001_Annex_AToolControls(Iso27001_Annex_AQueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetch_Iso_27001_Annex_AOverview();
      await fetchISO_27001_Annex_AToolControls(
        Iso27001_Annex_AQueryTools.getQuery()
      );
      closeModalFilter();
    })();
  }, [Iso27001_Annex_AQueryTools.query]);

  return {
    processing,
    iso27001_Annex_AControls,
    setIso27001_Annex_AControls,
    iso27001_Annex_AOverview,
    Iso27001_Annex_AQueryTools,
    updateDataTable,
    fetchISO_27001_Annex_AToolControls,
    modalFilter,
    toggleModalFilter,
  };
}
