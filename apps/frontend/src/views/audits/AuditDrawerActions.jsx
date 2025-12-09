import React from "react";

import useAccess from "@/hooks/useAccess";
import {
  DrawerOpener,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import authCompliance from "@/utils/complianceAuthCheck";
import { useAudits } from "./store";

const AuditDrawerActions = () => {
  const { visitingAudit } = useAudits();
  let { authUser } = useAccess();
  return (
    <React.Fragment>
      {!visitingAudit?.completed.status && (
        <UncontrolledDropdown>
          <DropdownToggle
            id="risk-actions"
            outline
            className="shadow-none border-0  "
            size="sm"
          >
            <i className="fa-solid fa-link" />
          </DropdownToggle>
          <DropdownMenu>
            <React.Fragment>
              {authCompliance() && (
                <DrawerOpener drawerId="compliance-control-picker">
                  <DropdownItem>Select Compliance Control(s)</DropdownItem>
                </DrawerOpener>
              )}
              <DrawerOpener drawerId="add-task-form">
                <DropdownItem>Create a task</DropdownItem>
              </DrawerOpener>
            </React.Fragment>
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </React.Fragment>
  );
};

export default AuditDrawerActions;
