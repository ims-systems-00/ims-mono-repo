import React from "react";
import useViewer from "./useViewer";
export const ViewerContext = React.createContext();
const ViewerContextProvider = ({ children }) => {
  let { viewerState, dispatchViewerState } = useViewer();
  return (
    <ViewerContext.Provider
      value={{
        viewerState,
        dispatchViewerState,
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
};
export default ViewerContextProvider;
