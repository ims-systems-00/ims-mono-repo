// import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import { Button, Spinner } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import NotificationContext from "../../contexts/notificationContext";
import USER_ACTIONS from "./actions";
import { useAudits } from "./store";
export const AttachmentButtons = ({ ...props }) => {
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage } = useAlerts();
  let { processing, isCompletedAudit, deleteAttachment } = useAudits();

  return (
    <>
      {alert}
      {!isCompletedAudit() &&
        authUser({
          service: IMS_SERVICES.AUDIT,
          action: ACTIONS.DELETE,
          effect: EFFECTS.ALLOW,
        }) && (
          <Button
            tooltip="Delete"
            onClick={(e) => {
              warningWithConfirmMessage("This version will be deleted", () => {
                deleteAttachment(props?.attachment);
              });
            }}
            disabled={
              processing[USER_ACTIONS.DELETE_ATTACHMENT] &&
              processing[USER_ACTIONS.DELETE_ATTACHMENT].id ===
                props?.attachment?._id
            }
            name="delete"
            size="sm"
            id="delete"
            color="link"
            className="btn-link-danger border border-0"
          >
            {" "}
            {processing[USER_ACTIONS.DELETE_ATTACHMENT] &&
            processing[USER_ACTIONS.DELETE_ATTACHMENT].id ===
              props?.attachment?._id ? (
              <Spinner size="sm" />
            ) : (
              <i className="ims-icons-20 icon-icon-trash-24" />
            )}
          </Button>
        )}
    </>
  );
};
