import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";

const CreateSupplier = () => {
  return (
    <React.Fragment>
      <Can
        policy={{
          service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
          action: ACTIONS.CREATE,
        }}
      >
        <DrawerOpener drawerId="create-supplier">
          <Button color="primary" size="md" className="shadow-sm--hover">
            <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
            {"  "} Add
          </Button>
        </DrawerOpener>
      </Can>
    </React.Fragment>
  );
};

export default CreateSupplier;
