import { useReducer } from "react";
import { imsLogger } from "@/services/loggerService";
import { IMPORTER_STATE_ACTIONS, USER_ACTIONS } from "./actions";
import { reducer } from "./reducer";
import useProcessingControl from "@/hooks/useProcessingControl";
let defaultState = {
  config: {
    module: "",
    format: "",
    dateFormat: "",
  },
  validationDataTransferProgress: 0,
  importDataTransferProgress: 0,
  imsSchema: [],
  selectedFiles: [],
  sheets: [],
  validations: {},
  validationSuccess: false,
  submissionSuccess: false,
};
const useDataImport = (initialState = defaultState) => {
  let [importerState, dispatchImporterState] = useReducer(
    reducer,
    initialState
  );
  imsLogger(importerState);
  let { processing, dispatch: dispatchProcessing } = useProcessingControl([
    { action: USER_ACTIONS.VALIDATION },
    { action: USER_ACTIONS.IMPORT },
  ]);
  function resetImporter() {
    dispatchImporterState({
      type: IMPORTER_STATE_ACTIONS.RESET_IMPORTER,
      payload: {
        initialState,
      },
    });
  }
  function _dataTransferProgress(progressEvent) {
    let progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    if (progress === 100) progress = 0;
    return progress;
  }
  function validationDataTransferProgress(progressEvent) {
    dispatchImporterState({
      type: IMPORTER_STATE_ACTIONS.VALIDATION_DATA_TRASFER,
      payload: {
        validationDataTransferProgress: _dataTransferProgress(progressEvent),
      },
    });
  }
  function importDataTransferProgress(progressEvent) {
    dispatchImporterState({
      type: IMPORTER_STATE_ACTIONS.IMPORT_DATA_TRASFER,
      payload: {
        importDataTransferProgress: _dataTransferProgress(progressEvent),
      },
    });
  }
  return {
    importerState,
    processing,
    dispatchProcessing,
    dispatchImporterState,
    resetImporter,
    validationDataTransferProgress,
    importDataTransferProgress,
  };
};
export default useDataImport;
