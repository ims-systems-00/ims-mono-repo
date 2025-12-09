import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAccess from "@/hooks/useAccess";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useIncident } from "./store";
import USER_ACTIONS from "./actions";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import useAlerts from "@/hooks/useAlerts";

const AttachmentButtons = ({ ...props }) => {
  let { isResolvedIncident, deleteAttachment, processing } = useIncident();
  let { authUser } = useAccess();
  let { alert, warningWithConfirmMessage } = useAlerts();

  return (
    <React.Fragment>
      {alert}
      {!isResolvedIncident() &&
        authUser({
          service: IMS_SERVICES.INCIDENT_MANAGEMENT,
          action: ACTIONS.DELETE,
          effect: EFFECTS.ALLOW,
        }) && (
          <TooltipButton
            tooltip="Delete"
            onClick={(e) => {
              warningWithConfirmMessage(
                "This attachment will be deleted",
                () => {
                  deleteAttachment(props?.attachment);
                }
              );
            }}
            disabled={
              processing[USER_ACTIONS.DELETE_ATTACHMENT].status &&
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
            {processing.action === "delete-attachment" &&
            processing.id === props?.attachment?._id ? (
              <Spinner size="sm" />
            ) : (
              <i className="ims-icons-20 icon-icon-trash-24" />
            )}
          </TooltipButton>
        )}
    </React.Fragment>
  );
};

export default AttachmentButtons;
