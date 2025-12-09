import React from "react";
import {
  DTRowAction,
  DTRowActionsMenu,
  DTRowActionsToggle,
  DTRowActionsDropdown,
  Spinner,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import { useHistory } from "react-router-dom";
import { PiDotsThreeCircleLight as ActionDotIcon } from "react-icons/pi";
import { ACTIONS, IMS_SERVICES } from "@/rolesAndPermissions";
import { USER_ACTIONS, useUserManager } from "./store";
import useAccess from "@/hooks/useAccess";
import { getCurrentSessionData } from "@/services/authService";
import useAlerts from "@/hooks/useAlerts";

export const RowActions = ({ row }) => {
  const history = useHistory();
  const { openDrawer } = useDrawer();
  let { warningWithConfirmMessage } = useAlerts();
  const { authUser } = useAccess();
  let { processing, visitUser, resendVerification } =
    useUserManager();

  const userData = row?.original?.data || row?.original || {};

  return (
    <React.Fragment>
      <DTRowActionsDropdown>
        <DTRowActionsToggle size="sm">
          <ActionDotIcon color="black" size={20}></ActionDotIcon>
        </DTRowActionsToggle>
        <DTRowActionsMenu>
          {userData?.emailVerified?.status === "pending" && (
            <DTRowAction
              onClick={(e) => {
                e.stopPropagation();
                warningWithConfirmMessage(
                  `Verification email will be sent to ${userData?.email}`,
                  () => {
                    resendVerification(userData);
                  }
                );
              }}
            >
              {processing[USER_ACTIONS.RESEND_VERIFICATION].status &&
              processing[USER_ACTIONS.RESEND_VERIFICATION].id ===
                userData?._id ? (
                <Spinner size="sm" />
              ) : (
                "Resend email"
              )}
            </DTRowAction>
          )}
          <DTRowAction
            onClick={(e) => {
              e.stopPropagation();
              visitUser(userData);
              history.push(`/admin/users/${userData?._id}`);
            }}
          >
            Details
          </DTRowAction>

          {authUser({
            service: IMS_SERVICES.INVITATIONS,
            action: ACTIONS.DELETE,
          }) &&
            userData?._id !== getCurrentSessionData().user?._id &&
            !userData?.accessPolicies?.length && (
              <DTRowAction
                onClick={(e) => {
                  e.stopPropagation();
                  visitUser(userData);
                  openDrawer("transfer-drawer");
                }}
              >
                {processing[USER_ACTIONS.DELETE_USER].status &&
                processing[USER_ACTIONS.DELETE_USER].id === userData?._id ? (
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
