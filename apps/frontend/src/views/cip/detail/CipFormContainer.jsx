import React, { useContext } from "react";
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { useCip } from "../store";
import ContinualImprovementPlanForm from "../ContinualImprovementPlanForm";

const CipFormContainer = () => {
  const { updateCip, implementCip, visitingCip } = useCip();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <ContinualImprovementPlanForm
        visitingCip={visitingCip}
        onSubmit={async (data) => {
          await updateCip(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onImplement={async (data) => {
          await implementCip(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default CipFormContainer;
