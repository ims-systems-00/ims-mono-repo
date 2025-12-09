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
          await updateIncident(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default IncidentFormContainer;
