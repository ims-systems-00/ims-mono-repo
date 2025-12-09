import React from "react";
import { useHistory } from "react-router-dom";
import {
  DTRowAction,
  DTRowActionsMenu,
  DTRowActionsToggle,
  DTRowActionsDropdown,
  Spinner,
} from "@ims-systems-00/ims-ui-kit";
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";
import USER_ACTIONS from "./actions";
import { useCampaign } from "./store";
import useAccess from "@/hooks/useAccess";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";

export const RowActions = ({ row }) => {
  const history = useHistory();
  const { processing, deleteCampaign } = useCampaign();
  const { authUser } = useAccess();

  return (
    <React.Fragment>
      <DTRowActionsDropdown>
        <DTRowActionsToggle size="sm">
          <ActionDotIcon color="black" size={20}></ActionDotIcon>
        </DTRowActionsToggle>
        <DTRowActionsMenu>
          <DTRowAction
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/admin/email-campaign/${row?.original?._id}`);
            }}
          >
            Details
          </DTRowAction>

          {authUser({
            service: IMS_SERVICES.CRM,
            action: ACTIONS.DELETE,
            effect: EFFECTS.ALLOW,
          }) &&
            row?.original?.status !== "Sent" && (
              <DTRowAction
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCampaign(row?.original);
                }}
              >
                {processing[USER_ACTIONS.REMOVE_EMAIL].status &&
                processing[USER_ACTIONS.REMOVE_EMAIL].id ===
                  row?.original?._id ? (
                  <Spinner size="sm" />
                ) : (
                  "Delete"
                )}
              </DTRowAction>
            )}
        </DTRowActionsMenu>
      </DTRowActionsDropdown>
    </React.Fragment>
  );
};