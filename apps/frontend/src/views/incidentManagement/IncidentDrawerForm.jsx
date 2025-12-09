import { useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import IncidentForm from "./IncidentForm";
import { useIncident } from "./store";

const IncidentDrawerForm = () => {
  let { visitingIncident, updateIncident, suppliers } = useIncident();
  const { closeDrawer, openDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingIncident} />
      <IncidentForm
        visitingIncident={visitingIncident}
        drawerView
        suppliers={suppliers}
        onSubmit={async (formData) => {
          const mutationData = {
            title: formData.title,
            description: formData.description,
            methodOfNotification: formData.methodOfNotification,
            priority: formData.priority.value,
            affectedService: formData.affectedService,
            owner: formData.owner.value,
            resolution: formData.resolution,
            resolveStatus: formData.resolveStatus,
            attachments: formData.attachments,
            tagsAndCategories: formData.tagsAndCategories.value,
          };
          await updateIncident(mutationData);
          closeDrawer("edit-incident-form");
        }}
      />
    </React.Fragment>
  );
};

export default IncidentDrawerForm;
