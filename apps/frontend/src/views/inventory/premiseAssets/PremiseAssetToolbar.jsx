import useAccess from "@/hooks/useAccess";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { EFFECTS } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { IMS_SERVICES } from "@/rolesAndPermissions";

const PremiseAssetToolBar = (props) => {
  let { authUser } = useAccess();
  return (
    <React.Fragment>
      {authUser({
        service: IMS_SERVICES.INVENTORY,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW,
      }) && (
        <DrawerOpener drawerId="edit-premise-asset-form">
          <Button outline size="sm" className="border-0 ">
            <i className="ims-icons-20 icon-icon-pencil-24" />
          </Button>
        </DrawerOpener>
      )}
    </React.Fragment>
  );
};

export default PremiseAssetToolBar;
