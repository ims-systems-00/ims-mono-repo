import {
  DrawerOpener,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";

const SupplierDrawerActions = ({ ...props }) => {
  return (
    <React.Fragment>
      <UncontrolledDropdown>
        <DropdownToggle
          id="risk-actions"
          outline
          className="shadow-none border-0  "
          size="sm"
        >
          <i className="ims-icons-20 icon-icon-link-24"></i>
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

export default SupplierDrawerActions;
