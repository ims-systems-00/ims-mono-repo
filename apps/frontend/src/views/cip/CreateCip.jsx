import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS } from "@/rolesAndPermissions";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import Can from "@/components/Can/Can";
const CreateCip = () => {
  return (
    <React.Fragment>
      <Can
        policy={{
          service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
          action: ACTIONS.CREATE,
        }}
      >
        <DrawerOpener drawerId="create-cip">
          <Button color="primary" size="md" className="shadow-sm--hover">
            <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
            {"  "} Raise
          </Button>
        </DrawerOpener>
      </Can>
    </React.Fragment>
  );
};

export default CreateCip;
