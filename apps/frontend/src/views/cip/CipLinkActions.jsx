import useAccess from "@/hooks/useAccess";
import {
  DrawerOpener,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import authCompliance from "@/utils/complianceAuthCheck";

const CipLinkActions = () => {
  let { authUser } = useAccess();
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
          {authUser(authCompliance()) && (
            <DrawerOpener drawerId="compliance-control-picker">
              <DropdownItem>Select Compliance Control(s)</DropdownItem>
            </DrawerOpener>
          )}
          <DrawerOpener drawerId="add-task-form">
            <DropdownItem>Create a task</DropdownItem>
          </DrawerOpener>
        </DropdownMenu>
      </UncontrolledDropdown>
    </React.Fragment>
  );
};

export default CipLinkActions;
