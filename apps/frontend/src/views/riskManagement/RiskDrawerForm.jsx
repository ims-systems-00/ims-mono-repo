import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import RiskForm from "./RiskForm";
import { useRisk } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const RiskDrawerForm = () => {
  const { visitingRisk, updateRisk } = useRisk();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingRisk} />
      <RiskForm
        visitingRisk={visitingRisk}
        drawerView
        onSubmit={async (formData) => {
          const mutationData = {
            group: formData.group.value,
            type: formData.type.value,
            owner: formData.owner.value,
            asset: formData.asset.value,
            title: formData.title,
            description: formData.description,
            likelihood: parseInt(formData.likelihood.value),
            consequence: parseInt(formData.consequence.value),
            controlsAndMitigation: formData.controlsAndMitigation,
            mitigationStatus: formData.mitigationStatus,
            acceptanceRational: formData.acceptanceRational,
            decisionMaker: formData.decisionMaker,
            acceptanceStatus: formData.acceptanceStatus,
            attachments: formData.attachments,
            tagsAndCategories: formData.tagsAndCategories.value,
          };
          await updateRisk(mutationData);
          closeDrawer("edit-risk-form");
        }}
      />
    </React.Fragment>
  );
};

export default RiskDrawerForm;
