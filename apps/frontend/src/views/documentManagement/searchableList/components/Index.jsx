import React from "react";
import { SearchableDocumentContextProvider } from "../store";
import Contents from "./Contents";
import TabContents from "./TabContents";

const SearchableDocument = ({
  onSelectionChange = () => {},
  onResultsChange = () => {},
  onNewSelection = () => {},
  onDeselection = () => {},
  preSelectedDocuments = [],
  preDisabledDocuments = [],
  moduleTypes = [],
  complianceTools = [],
}) => {
  return (
    <SearchableDocumentContextProvider
      onResultsChange={onResultsChange}
      onSelectionChange={onSelectionChange}
      onNewSelection={onNewSelection}
      onDeselection={onDeselection}
      preSelectedDocuments={preSelectedDocuments}
      preDisabledDocuments={preDisabledDocuments}
      moduleTypes={moduleTypes}
      complianceTools={complianceTools}
    >
      <Contents />
    </SearchableDocumentContextProvider>
  );
};

const TabSearchableDocument = ({
  onSelectionChange = () => {},
  onResultsChange = () => {},
  onNewSelection = () => {},
  onDeselection = () => {},
  preSelectedDocuments = [],
  preDisabledDocuments = [],
  moduleTypes = [],
  complianceTools = [],
}) => {
  return (
    <SearchableDocumentContextProvider
      onResultsChange={onResultsChange}
      onSelectionChange={onSelectionChange}
      onNewSelection={onNewSelection}
      onDeselection={onDeselection}
      preSelectedDocuments={preSelectedDocuments}
      preDisabledDocuments={preDisabledDocuments}
      moduleTypes={moduleTypes}
      complianceTools={complianceTools}
    >
      <TabContents />
    </SearchableDocumentContextProvider>
  );
};

export { default as DocumentListOpener } from "./DocumentListOpener";
export { TabSearchableDocument };
export default SearchableDocument;
