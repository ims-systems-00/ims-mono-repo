import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import React, { useContext } from "react";
import IncidentForm from "../IncidentForm";
import { useIncident } from "../store";

const IncidentFormContainer = () => {
  const { updateIncident, visitingIncident } = useIncident();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <IncidentForm
        visitingIncident={visitingIncident}
        onSubmit={async (data) => {
          const mutationData = {
            title: data.title,
            description: data.description,
            methodOfNotification: data.methodOfNotification,
            affectedService: data.affectedService,
            attachments: data.attachments,
            resolveStatus: data.resolveStatus,
            resolution: data.resolution,
            group: data.group.value,
            tagsAndCategories: data.tagsAndCategories.value,
            owner: data.owner.value,
            group: data.group.value,
            priority: data.priority.value,
            privacy: data.privacy ? "Organisational" : "Business unit",
          };
          await updateIncident(mutationData);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default IncidentFormContainer;
