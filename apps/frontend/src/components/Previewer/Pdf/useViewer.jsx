import { useReducer } from "react";
import { imsLogger } from "@/services/loggerService";
import { VIEWER_STATE_ACTIONS } from "./actions";
function reducer(state, action) {
  switch (action.type) {
    case VIEWER_STATE_ACTIONS.UPDATE_CURRENT_PAGE:
      return { ...state, currentPage: action?.payload?.currentPage };
    case VIEWER_STATE_ACTIONS.UPDATE_TOTAL_PAGES:
      return { ...state, totalPages: action?.payload?.totalPages };
    default:
      return Error(`${action.type} is not allowed.`);
  }
}
const useViewer = (initialState = { currentPage: 1, totalPages: 0 }) => {
  let [viewerState, dispatchViewerState] = useReducer(reducer, initialState);
  // imsLogger(viewerState)
  return {
    viewerState,
    dispatchViewerState,
  };
};
export default useViewer;
