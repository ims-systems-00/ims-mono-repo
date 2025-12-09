import React from "react";
import {
  DTRowAction,
  DTRowActionsMenu,
  DTRowActionsToggle,
  DTRowActionsDropdown,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";

export const RowActions = ({ row, updateDataTable }) => {
  let { openDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DTRowActionsDropdown>
        <DTRowActionsToggle size="sm">
          <ActionDotIcon color="black" size={20}></ActionDotIcon>
        </DTRowActionsToggle>
        <DTRowActionsMenu>
          <DTRowAction
            onClick={(e) => {
              openDrawer("complaince-detail");
            }}
          >
            Details
          </DTRowAction>
        </DTRowActionsMenu>
      </DTRowActionsDropdown>
    </React.Fragment>
  );
};
