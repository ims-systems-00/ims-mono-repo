import Can from "@/components/Can/Can";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";
const HardwareAssetToolbar = (props) => {
  return (
    <Can policy={{ service: IMS_SERVICES.INVENTORY, action: ACTIONS.DELETE }}>
      <DrawerOpener drawerId="edit-hardware-asset-form">
        <Button outline size="sm" className="border-0 ">
          <i className="ims-icons-20 icon-icon-pencil-24" />
        </Button>
      </DrawerOpener>
    </Can>
  );
};

export default HardwareAssetToolbar;
