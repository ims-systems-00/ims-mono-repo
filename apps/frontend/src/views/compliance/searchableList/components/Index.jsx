import React from "react";
import { SearchableComplainceContextProvider } from "../store";
import Contents from "./Contents";

const SearchableCompliance = ({
  onSelectionChange = () => {},
  onResultsChange = () => {},
  onNewSelection = () => {},
  onDeselection = () => {},
  preSelectedControls = [],
  preDisabledControls = [],
}) => {
  return (
    <React.Fragment>
      <SearchableComplainceContextProvider
        onResultsChange={onResultsChange}
        onSelectionChange={onSelectionChange}
        onNewSelection={onNewSelection}
        onDeselection={onDeselection}
        preSelectedControls={preSelectedControls}
        preDisabledControls={preDisabledControls}
      >
        <Contents />
      </SearchableComplainceContextProvider>
    </React.Fragment>
  );
};

export default SearchableCompliance;
