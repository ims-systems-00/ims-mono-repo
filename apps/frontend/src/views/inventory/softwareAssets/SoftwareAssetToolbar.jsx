import useAccess from "@/hooks/useAccess";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";

const SoftwareAssetToolBar = (props) => {
  let { authUser } = useAccess();
  return (
    <React.Fragment>
      {authUser({
        service: IMS_SERVICES.INVENTORY,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW,
      }) && (
        <DrawerOpener drawerId="edit-software-asset-form">
          <Button outline size="sm" className="border-0 ">
            <i className="ims-icons-20 icon-icon-pencil-24" />
          </Button>
        </DrawerOpener>
      )}
    </React.Fragment>
  );
};

export default SoftwareAssetToolBar;
