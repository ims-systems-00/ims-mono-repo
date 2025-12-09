import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import { useEffect, useState } from "react";
import * as complainceApi from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import { useApplication } from "@/stores/applicationStore";
import * as organizationService from "../../../../services/organizationService";
import USER_ACTIONS from "./actions";

export default function useStore(config) {
  const [avaibaleControls, setAvaialeControls] = useState([]);
  const [selectedControls, setSelectedControls] = useState([]);
  const [disabledControls, setDisabledControls] = useState([]);
  const [avialableToolokits, setAvailableToolkits] = useState([]);
  const { tokenPair } = useApplication();
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const controlsQueryUtils = useQuery();
  async function _loadLicenses() {
    try {
      let { data } = await organizationService.getLicenses(
        tokenPair?.accessTokenData?.user?.organizationId
      );
      setAvailableToolkits(data.licenses?.complianceTools);
    } catch (err) {
      imsLogger(err);
    }
  }
  async function _loadControls(qstr = "") {
    try {
      _dispatch({
        [USER_ACTIONS.SEARCH_CONTROLS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await complainceApi.getCompliance({
        query: `${qstr}`,
      });
      setAvaialeControls(data.compliance);
      controlsQueryUtils.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.SEARCH_CONTROLS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err);
      _dispatch({
        [USER_ACTIONS.SEARCH_CONTROLS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  function searchControls(keywords) {
    controlsQueryUtils.handleSearch({ value: { clientSearch: keywords } });
  }
  function visitPrevPage() {
    if (controlsQueryUtils.toolState.pagination.hasPrevPage) {
      controlsQueryUtils.handlePagination({
        page: controlsQueryUtils.toolState.pagination.prevPage,
      });
    }
  }
  function visitNextPage() {
    if (controlsQueryUtils.toolState.pagination.hasNextPage) {
      controlsQueryUtils.handlePagination({
        page: controlsQueryUtils.toolState.pagination.nextPage,
      });
    }
  }
  function applyToolFilters(tools = []) {
    let filter = {
      value: {
        name: {
          in: avialableToolokits,
        },
      },
    };
    if (tools?.length) {
      filter = {
        value: {
          name: {
            in: tools,
          },
        },
      };
    }
    controlsQueryUtils.handleFilter(filter);
  }
  function toggleControlSelection(control) {
    setSelectedControls((controls) => {
      let newControls = [];
      if (selectedControls.find((c) => c._id === control._id)) {
        /** returns the single deselected control */
        newControls = controls.filter((c) => c._id !== control._id);
        config.onDeselection(control);
      } else {
        /** returns the single newly selected control */
        newControls = [control, ...controls];
        config.onNewSelection(control);
      }
      config.onSelectionChange(newControls);
      return newControls;
    });
  }
  function isControlSelected(id) {
    return selectedControls.find((c) => c._id === id);
  }
  function isControlDisabled(id) {
    return disabledControls.find((c) => c._id === id);
  }
  useEffect(() => {
    if (avialableToolokits) _loadControls(controlsQueryUtils.getQuery());
  }, [controlsQueryUtils.query, avialableToolokits]);
  useEffect(() => {
    controlsQueryUtils.handleFilter({
      value: {
        name: {
          in: avialableToolokits,
        },
      },
    });
  }, [avialableToolokits]);
  useEffect(() => {
    setSelectedControls((controls) => {
      return config.preSelectedControls;
    });
  }, [config.preSelectedControls]);
  useEffect(() => {
    setDisabledControls(config.preDisabledControls);
  }, [config.preDisabledControls]);
  useEffect(() => {
    _loadLicenses();
  }, []);
  let numberOfSelectedControls = selectedControls.length;
  return {
    avaibaleControls,
    selectedControls,
    avialableToolokits,
    processing,
    toggleControlSelection,
    searchControls,
    visitNextPage,
    visitPrevPage,
    isControlSelected,
    isControlDisabled,
    applyToolFilters,
    numberOfSelectedControls,
  };
}
