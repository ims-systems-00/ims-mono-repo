import React from "react";
import { AnalyticsDocumentContextProvider } from "./store";
import DocumentList from "./DocumentList";

const DocumentOverview = (props) => {
  const getTitle = () => {
    if (props.match.params.purpose === "Standard operating procedure")
      return "Standard operating procedures";
    if (props.match.params.purpose === "Policy") return "Policies";
    if (props.match.params.purpose === "Legal") return "Legal documents";
    if (props.match.params.purpose === "Process") return "Processes";
    if (props.match.params.purpose === "Miscellaneous") return "Miscellaneous";
  };
  return (
    <div className="content">
      <h4 className="text-primary text-center p-2 m-2">{getTitle()}</h4>
      <AnalyticsDocumentContextProvider purpose={props.match.params.purpose}>
        <DocumentList />
      </AnalyticsDocumentContextProvider>
    </div>
  );
};

export default DocumentOverview;
