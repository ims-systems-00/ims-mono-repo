import React from "react";
import { useHistory } from "react-router-dom";
import {
  DTRowAction,
  DTRowActionsMenu,
  DTRowActionsToggle,
  DTRowActionsDropdown,
} from "@ims-systems-00/ims-ui-kit";
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";

export const OrganisationRowActions = ({ row, onUpdate }) => {
  const history = useHistory();

  return (
    <React.Fragment>
      <DTRowActionsDropdown>
        <DTRowActionsToggle size="sm">
          <ActionDotIcon color="black" size={20} />
        </DTRowActionsToggle>
        <DTRowActionsMenu>
          <DTRowAction
            onClick={(e) => {
              e.stopPropagation();
              // Call the handler passed from parent
              if (onUpdate) onUpdate();
            }}
          >
            Update
          </DTRowAction>
        </DTRowActionsMenu>
      </DTRowActionsDropdown>
    </React.Fragment>
  );
};
