import useAccess from "@/hooks/useAccess";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";

const CreateOrganizationAsset = () => {
  const { authUser } = useAccess();
  return (
    <React.Fragment>
      {authUser({
        service: IMS_SERVICES.INVENTORY,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW,
      }) && (
        <React.Fragment>
          <DrawerOpener drawerId="create-organization-asset-form">
            <Button color="primary" size="md" className="shadow-sm--hover">
              <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
              {"  "} Add
            </Button>
          </DrawerOpener>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CreateOrganizationAsset;
