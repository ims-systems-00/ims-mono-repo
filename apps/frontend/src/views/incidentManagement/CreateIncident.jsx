import Can from "@/components/Can/Can";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS } from "@/rolesAndPermissions";
import { IMS_SERVICES } from "@/rolesAndPermissions";

const CreateIncident = () => {
  return (
    <React.Fragment>
      <Can
        policy={{
          service: IMS_SERVICES.INCIDENT_MANAGEMENT,
          action: ACTIONS.CREATE,
        }}
      >
        <DrawerOpener drawerId="create-incident">
          <Button color="primary" size="md" className="shadow-sm--hover">
            <i class="ims-icons-20 icon-icon-notepencil-24 me-1 p-0" />
            Raise
          </Button>
        </DrawerOpener>
      </Can>
    </React.Fragment>
  );
};

export default CreateIncident;
