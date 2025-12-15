import React from "react";
import Can from "@/components/Can/Can";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";

import { ACTIONS, IMS_SERVICES } from "@/rolesAndPermissions";

const CreateOrgButton = () => {
  return (
    <Can
      policy={{
        service: IMS_SERVICES.ADMIN_MANAGEMENT,
        action: ACTIONS.CREATE,
      }}
    >
      <DrawerOpener drawerId="organisation-create">
        <Button color="primary" size="md" className="shadow-sm--hover">
          <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
          Create
        </Button>
      </DrawerOpener>
    </Can>
  );
};

export default CreateOrgButton;
