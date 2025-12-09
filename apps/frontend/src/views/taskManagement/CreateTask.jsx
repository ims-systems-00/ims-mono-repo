import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const CreateTask = () => {
  return (
    <React.Fragment>
      <DrawerOpener drawerId="create-task">
        <Button color="primary" size="md" className="shadow-sm--hover">
          <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
          {"  "} Create
        </Button>
      </DrawerOpener>
    </React.Fragment>
  );
};

export default CreateTask;
