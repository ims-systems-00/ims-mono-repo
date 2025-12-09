import { imsLogger } from "@/services/loggerService";
import { IMPORTER_STATE_ACTIONS } from "./actions";
export function reducer(state, action) {
  imsLogger(action);
  switch (action.type) {
    case IMPORTER_STATE_ACTIONS.UPDATE_SELECTED_FILES:
      return { ...state, selectedFiles: action?.payload?.files };
    case IMPORTER_STATE_ACTIONS.UPDATE_SHEETS:
      return { ...state, sheets: action?.payload?.sheets };
    case IMPORTER_STATE_ACTIONS.UPDATE_IMS_SCHEMA:
      return { ...state, imsSchema: action.payload.imsSchema };
    case IMPORTER_STATE_ACTIONS.RESET_IMPORTER:
      return { ...state, ...action?.payload?.initialState };
    case IMPORTER_STATE_ACTIONS.SUBMISSION_SUCCESS:
      return { ...state, submissionSuccess: true };
    case IMPORTER_STATE_ACTIONS.UPDATE_CONFIG:
      return { ...state, config: action?.payload?.config };
    case IMPORTER_STATE_ACTIONS.VALIDATION_DATA_TRASFER:
      return {
        ...state,
        validationDataTransferProgress:
          action?.payload?.validationDataTransferProgress,
      };
    case IMPORTER_STATE_ACTIONS.IMPORT_DATA_TRASFER:
      return {
        ...state,
        importDataTransferProgress: action?.payload?.importDataTransferProgress,
      };
    case IMPORTER_STATE_ACTIONS.ADD_DATA_MAP: {
      let sheets = state?.sheets.map((sheet, index) => {
        let map = action.payload?.map;
        let dataMap = { ...sheet.dataMap };
        dataMap[map.key] = map.value;
        return action.payload.sheetIndex === index
          ? {
              ...sheet,
              dataMap,
            }
          : sheet;
      });
      return { ...state, sheets };
    }
    case IMPORTER_STATE_ACTIONS.REMOVE_DATA_MAP: {
      let sheets = state?.sheets.map((sheet, index) => {
        let map = action.payload?.map;
        let dataMap = { ...sheet.dataMap };
        delete dataMap[map.key];
        return action.payload.sheetIndex === index
          ? {
              ...sheet,
              dataMap,
            }
          : sheet;
      });
      return { ...state, sheets };
    }
    case IMPORTER_STATE_ACTIONS.UPDATE_VALIDATIONS: {
      let validations = action?.payload?.validations;
      let validationSuccess = Object.keys(action?.payload?.validations).find(
        (sheet) => !validations[sheet].success
      )
        ? false
        : true;
      return { ...state, validations, validationSuccess };
    }
    default:
      return Error(`${action.type} is not allowed.`);
  }
}
