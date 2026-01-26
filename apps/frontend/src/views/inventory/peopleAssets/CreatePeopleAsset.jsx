import useAccess from "@/hooks/useAccess";
import { Button, DrawerOpener, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { TourStep } from "../../../components/Tour";

const CreatePeopleAsset = () => {
  let { authUser } = useAccess();

  const { toggle } = useDrawer();
  return (
    <React.Fragment>
      <TourStep stepId="create-people-button">
        {authUser({
          service: IMS_SERVICES.INVENTORY,
          action: ACTIONS.CREATE,
          effect: EFFECTS.ALLOW,
        }) && (
          <React.Fragment>
            <DrawerOpener drawerId="create-people-asset-form">
              <Button color="primary" size="md" className="shadow-sm--hover">
                <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
                {"  "} Add
              </Button>
            </DrawerOpener>
          </React.Fragment>
        )}
      </TourStep>
    </React.Fragment>
  );
};

export default CreatePeopleAsset;
