import React from "react";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import { useLeave } from "./store";

const LeaveToolBar = () => {
  let { visitingLeave: leave, getSubmissionStatus } = useLeave();
  return (
    <React.Fragment>
      {getSubmissionStatus(leave) !== "Approved" &&
        getSubmissionStatus(leave) !== "Rejected" && (
          <DrawerOpener drawerId="edit-leave-form">
            <Button outline size="sm" className="border-0 ">
              <i className="ims-icons-20 icon-icon-pencil-24" />
            </Button>
          </DrawerOpener>
        )}
    </React.Fragment>
  );
};

export default LeaveToolBar;
