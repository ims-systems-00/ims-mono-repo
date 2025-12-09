import useAccess from "@/hooks/useAccess";
import {
  DrawerOpener,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";

const ReviewLinksActions = ({ ...props }) => {
  return (
    <React.Fragment>
      <UncontrolledDropdown>
        <DropdownToggle
          id="review-actions"
          outline
          className="shadow-none border-0  "
          size="sm"
        >
          <i className="fa-solid fa-link"></i>
        </DropdownToggle>
        <DropdownMenu>
          <React.Fragment>
            <DrawerOpener drawerId="add-task-form">
              <DropdownItem>Create a task</DropdownItem>
            </DrawerOpener>
          </React.Fragment>
        </DropdownMenu>
      </UncontrolledDropdown>
    </React.Fragment>
  );
};

export default ReviewLinksActions;
