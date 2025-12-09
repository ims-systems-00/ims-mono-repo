import React from "react";
import useDocumentStore from "./useDocumentStore";
export const DocumentContext = React.createContext();
const DocumentContextProvider = ({ children, ...rest }) => {
  let { ...store } = useDocumentStore({
    repoId: rest.repoId,
    docId: rest.docId,
  });
  return (
    <DocumentContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
export default DocumentContextProvider;
