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

const ComplianceEvidenceLinkActions = () => {
  let { authUser } = useAccess();
  return (
    <React.Fragment>
      <UncontrolledDropdown>
        <DropdownToggle
          id="evidence-actions"
          outline
          className="shadow-none border-0  "
          size="sm"
        >
          <i className="ims-icons-20 icon-icon-link-24"></i>
        </DropdownToggle>
        <DropdownMenu>
          {authUser(authCompliance()) && (
            <DrawerOpener drawerId="risk-link-evidence">
              <DropdownItem>Link a risk</DropdownItem>
            </DrawerOpener>
          )}
          {authUser(authCompliance()) && (
            <DrawerOpener drawerId="incident-link-evidence">
              <DropdownItem>Link a incident</DropdownItem>
            </DrawerOpener>
          )}
          {authUser(authCompliance()) && (
            <DrawerOpener drawerId="cip-link-evidence">
              <DropdownItem>Link a CIP</DropdownItem>
            </DrawerOpener>
          )}

          {authUser(authCompliance()) && (
            <DrawerOpener drawerId="document-link-evidence">
              <DropdownItem>Link a document tree</DropdownItem>
            </DrawerOpener>
          )}
          {authUser(authCompliance()) && (
            <DrawerOpener drawerId="file-link-evidence">
              <DropdownItem>Link a file</DropdownItem>
            </DrawerOpener>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>
    </React.Fragment>
  );
};

export default ComplianceEvidenceLinkActions;
