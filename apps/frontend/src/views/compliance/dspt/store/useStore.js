import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import {
  getCompliance,
  getComplianceOverview,
  mapToISOOverview,
} from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import LOADER from "../actions";

export default function useStore(config) {
  let [dsptToolControls, setDsptToolControls] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_OVERVIEW_DSPT, status: true },
    { action: LOADER.LOAD_COMPLIANCE_DSPT, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
  ]);
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let [dsptOverview, setDsptOverview] = React.useState({});
  let DSPTQueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.DSPTNHS } },
  });
  const fetchDsptToolControls = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_DSPT]: { status: true, error: false, id: null },
      });
      let { data } = await getCompliance({
        query: qstr,
      });
      setDsptToolControls(data.compliance);
      DSPTQueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_COMPLIANCE_DSPT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_COMPLIANCE_DSPT]: { status: false, error: true, id: null },
      });
      imsLogger("DSPT", ex);
    }
  };

  const fetchDsptOverview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_OVERVIEW_DSPT]: { status: true, error: false, id: null },
      });
      let { data } = await getComplianceOverview(IMS_SERVICES.DSPTNHS);
      let mapedData = mapToISOOverview(data.overview);
      setDsptOverview({ overall: mapedData });
      dispatch({
        [LOADER.LOAD_OVERVIEW_DSPT]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_OVERVIEW_DSPT]: { status: false, error: true, id: null },
      });
      imsLogger("DSPT", ex);
    }
  };

  let updateDataTable = () => {
    fetchDsptOverview();
    fetchDsptToolControls(DSPTQueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      await fetchDsptToolControls(DSPTQueryTools.getQuery());
      fetchDsptOverview();
      closeModalFilter();
    })();
  }, [DSPTQueryTools.query]);

  return {
    processing,
    dsptToolControls,
    setDsptToolControls,
    dsptOverview,
    DSPTQueryTools,
    fetchDsptToolControls,
    updateDataTable,
    modalFilter,
    toggleModalFilter,
  };
}
