import Can from "@/components/Can/Can";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, IMS_SERVICES } from "@/rolesAndPermissions";
import { TourStep } from "@/components/Tour";

const CreateUser = () => {
  return (
    <Can
      policy={{
        service: IMS_SERVICES.INVITATIONS,
        action: ACTIONS.CREATE,
      }}
    >
      <TourStep key="create-user-step" stepId="create-user-button">
        <DrawerOpener drawerId="create-user">
          <Button color="primary" size="md" className="shadow-sm--hover">
            <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
            {"  "} Add user
          </Button>
        </DrawerOpener>
      </TourStep>
    </Can>
  );
};

export default CreateUser;
