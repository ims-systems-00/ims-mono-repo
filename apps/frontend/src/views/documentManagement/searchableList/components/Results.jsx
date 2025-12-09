import React from "react";
import DocumentStripe from "./DocumentStripe";
import { useSearchableDocument } from "../store";
const Results = ({}) => {
  const {
    availableDocuments,
    isDocumentSelected,
    isDocumentDisabled,
    viewDocument,
  } = useSearchableDocument();
  return (
    <React.Fragment>
      {availableDocuments.map((document) => (
        <DocumentStripe
          key={document._id}
          document={document}
          isActive={isDocumentSelected(document?._id)}
          isDiabled={isDocumentDisabled(document?._id)}
          onClick={() => viewDocument(document)}
        />
      ))}
    </React.Fragment>
  );
};

export default Results;
