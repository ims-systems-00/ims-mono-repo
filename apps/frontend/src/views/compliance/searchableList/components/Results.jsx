import React from "react";
import ComplianceStripe from "./ComplianceStripe";
import { useSearchableCompliance } from "../store";
const Results = ({}) => {
  const {
    avaibaleControls,
    isControlSelected,
    isControlDisabled,
    toggleControlSelection,
  } = useSearchableCompliance();
  return (
    <React.Fragment>
      {avaibaleControls.map((control) => (
        <ComplianceStripe
          key={control._id}
          compliance={control}
          isActive={isControlSelected(control?._id)}
          isDiabled={isControlDisabled(control?._id)}
          onClick={toggleControlSelection}
        />
      ))}
    </React.Fragment>
  );
};

export default Results;
