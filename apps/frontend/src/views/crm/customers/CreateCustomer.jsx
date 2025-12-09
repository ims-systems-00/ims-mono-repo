import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const CreateCustomer = () => {
  return (
    <Can
      policy={{
        service: IMS_SERVICES.CRM,
        action: ACTIONS.CREATE,
      }}
    >
      <DrawerOpener drawerId="create-customer">
        <Button color="primary" size="md" className="shadow-sm--hover">
          <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
          {"  "} Add
        </Button>
      </DrawerOpener>
    </Can>
  );
};

export default CreateCustomer;
