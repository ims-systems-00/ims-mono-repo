import React from "react";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import useAccess from "@/hooks/useAccess";

const PeopleAssetToolbar = () => {
  let { authUser } = useAccess();
  return (
    <React.Fragment>
      {authUser({
        service: IMS_SERVICES.INVENTORY,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW,
      }) && (
        <DrawerOpener drawerId="edit-people-form">
          <Button outline size="sm" className="border-0 ">
            <i className="ims-icons-20 icon-icon-pencil-24" />
          </Button>
        </DrawerOpener>
      )}
    </React.Fragment>
  );
};

export default PeopleAssetToolbar;
