import { IMS_POLICIES } from "@/rolesAndPermissions";
import {
  DTRowAction,
  DTRowActionsDropdown,
  DTRowActionsMenu,
  DTRowActionsToggle,
  DrawerOpener,
} from "@ims-systems-00/ims-ui-kit";
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";
import { TourStep } from "../../../components/Tour";

const RowActions = ({ row, onDetails }) => {
  const group = row?.original;
  return (
    <TourStep stepId="business-unit-details">
      <DTRowActionsDropdown>
        <DTRowActionsToggle size="sm">
          <ActionDotIcon color="black" size={20}></ActionDotIcon>
        </DTRowActionsToggle>
        <DTRowActionsMenu>
          <DrawerOpener>
            {group?.name !== IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION ? (
              <DTRowAction
                onClick={(e) => {
                  e.stopPropagation();
                  onDetails && onDetails(group);
                }}
              >
                Details
              </DTRowAction>
            ) : (
              <DTRowAction disabled>Default</DTRowAction>
            )}
          </DrawerOpener>
        </DTRowActionsMenu>
      </DTRowActionsDropdown>
    </TourStep>
  );
};

export default RowActions;
