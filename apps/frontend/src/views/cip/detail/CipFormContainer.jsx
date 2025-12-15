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
          const mutationData = {
            owner: data.owner.value,
            title: data.title,
            cost: data.cost,
            attachments: data.attachments,
            opportunityForImprovement: data.opportunityForImprovement,
          };
          await updateCip(mutationData);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onImplement={async (data) => {
          const mutationData = {
            owner: data.owner.value,
            title: data.title,
            cost: data.cost,
            attachments: data.attachments,
            opportunityForImprovement: data.opportunityForImprovement,
          };
          await implementCip(mutationData);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default CipFormContainer;
