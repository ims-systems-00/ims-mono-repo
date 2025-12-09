import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const CreateTagsAndCategories = () => {
  return (
    <React.Fragment>
      <DrawerOpener drawerId="create-tag">
        <Button color="primary" size="md" className="shadow-sm--hover">
          <i className="ims-icons icon-icon-notepencil-24 me-1 p-0"></i>
          {"  "} Create
        </Button>
      </DrawerOpener>
    </React.Fragment>
  );
};

export default CreateTagsAndCategories;
