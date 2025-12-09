import React, { useContext } from "react";
import RiskForm from "../RiskForm";
import { useRisk } from "../store";
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";

const RiskFormContainer = () => {
  const { visitingRisk, updateRisk } = useRisk();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <RiskForm
        visitingRisk={visitingRisk}
        onSubmit={async (data) => {
          await updateRisk(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default RiskFormContainer;
