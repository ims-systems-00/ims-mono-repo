import React from "react";
import useViewerStore from "./useViewerStore";
export const ViewerContext = React.createContext();
const ViewerContextProvider = ({ children, fileDetails, onPageClick }) => {
  let { ...store } = useViewerStore({ fileDetails, onPageClick });
  return (
    <ViewerContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
};
export default ViewerContextProvider;
