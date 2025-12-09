import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const CampaignToolBar = (props) => {
  return (
    <React.Fragment>
      <DrawerOpener drawerId="edit-campaign-form">
        <Button outline size="sm" className="border-0 ">
          <i className="ims-icons-20 icon-icon-pencil-24" />
        </Button>
      </DrawerOpener>
    </React.Fragment>
  );
};

export default CampaignToolBar;
