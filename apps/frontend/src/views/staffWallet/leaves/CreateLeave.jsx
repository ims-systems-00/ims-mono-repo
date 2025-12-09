import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const CreateLeave = () => {
  return (
    <React.Fragment>
      <DrawerOpener drawerId="create-leave">
        <Button color="primary" size="md" className="shadow-sm--hover">
          <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>{" "}
          Request
        </Button>
      </DrawerOpener>
    </React.Fragment>
  );
};

export default CreateLeave;
