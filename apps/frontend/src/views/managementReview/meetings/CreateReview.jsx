import Can from "@/components/Can/Can";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";

const CreateReview = () => {
  return (
    <Can
      policy={{
        service: IMS_SERVICES.MANAGEMENT_REVIEW,
        action: ACTIONS.CREATE,
      }}
    >
      <DrawerOpener drawerId="create-review">
        <Button color="primary" size="md" className="shadow-sm--hover">
          <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
          {"  "} Schedule
        </Button>
      </DrawerOpener>
    </Can>
  );
};

export default CreateReview;
