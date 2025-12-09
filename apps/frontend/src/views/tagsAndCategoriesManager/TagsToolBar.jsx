import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const TagsToolBar = () => {
  return (
    <React.Fragment>
      <DrawerOpener drawerId="edit-tag-form">
        <Button outline size="sm" className="border-0 ">
          <i className="ims-icons icon-icon-pencil-24" />
        </Button>
      </DrawerOpener>
    </React.Fragment>
  );
};

export default TagsToolBar;
