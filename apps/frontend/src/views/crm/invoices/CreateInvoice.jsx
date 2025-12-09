import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const CreateInvoice = () => {
  return (
    <Can
      policy={{
        service: IMS_SERVICES.CRM,
        action: ACTIONS.CREATE,
      }}
    >
      <DrawerOpener drawerId="create-invoice">
        <Button color="primary" size="md" className="shadow-sm--hover">
          <i class="ims-icons-20 icon-icon-notepencil-24 me-1 p-0" />
          Create
        </Button>
      </DrawerOpener>
    </Can>
  );
};

export default CreateInvoice;
