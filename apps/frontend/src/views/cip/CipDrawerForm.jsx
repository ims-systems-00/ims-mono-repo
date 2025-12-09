import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import ContinualImprovementPlanForm from "./ContinualImprovementPlanForm";
import { useCip } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const CipDrawerForm = () => {
  const { visitingCip, updateCip, implementCip } = useCip();
  const { closeDrawer, openDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingCip} />
      <ContinualImprovementPlanForm
        visitingCip={visitingCip}
        drawerView
        onSubmit={async (formData) => {
          const mutationData = {
            owner: formData.owner.value,
            title: formData.title,
            cost: formData.cost,
            attachments: formData.attachments,
            opportunityForImprovement: formData.opportunityForImprovement,
          };
          await updateCip(mutationData);
          closeDrawer("edit-cip-form");
        }}
        onImplement={async (formData) => {
          const mutationData = {
            owner: formData.owner.value,
            title: formData.title,
            cost: formData.cost,
            attachments: formData.attachments,
            opportunityForImprovement: formData.opportunityForImprovement,
          };
          await implementCip(mutationData);
          closeDrawer("edit-cip-form");
        }}
      />
    </React.Fragment>
  );
};

export default CipDrawerForm;
