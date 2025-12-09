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
      <DrawerOpener drawerId="create-user">
        <TourStep key="create-user" stepId="create-user">
          <Button color="primary" size="md" className="shadow-sm--hover">
            <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
            {"  "} Add user
          </Button>
        </TourStep>
      </DrawerOpener>
    </Can>
  );
};

export default CreateUser;
