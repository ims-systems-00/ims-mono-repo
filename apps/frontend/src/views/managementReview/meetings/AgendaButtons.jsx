import TooltipButton from "@/components/Tooltip/TooltipButton";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { deleteMinutes } from "@/services/managementReviewServices";
import { ManagementReviewActionsContext } from "./context/ManagementReviewActionsContext";
import { useSchedule } from "./store";
import USER_ACTIONS from "./actions";

const AgendaButtons = ({ ...props }) => {
  let { isCompletedManagementReview, deleteAgenda, processing } = useSchedule();
  let notify = React.useContext(NotificationContext);
  let { authUser } = useAccess();
  let { alert, warningWithConfirmMessage } = useAlerts();

  return (
    <>
      {alert}
      {!isCompletedManagementReview() &&
        authUser({
          service: IMS_SERVICES.MANAGEMENT_REVIEW,
          action: ACTIONS.DELETE,
          effect: EFFECTS.ALLOW,
        }) && (
          <TooltipButton
            tooltip="Delete"
            onClick={(e) => {
              warningWithConfirmMessage("This agenda will be deleted", () => {
                deleteAgenda(props?.attachment);
              });
            }}
            disabled={
              processing[USER_ACTIONS.DELETE_MINUTE].status &&
              processing[USER_ACTIONS.DELETE_MINUTE].id ===
                props?.attachment?._id
            }
            name="delete"
            size="sm"
            id="delete"
            // className="btn-icon  like btn-danger"

            color="link"
            className="btn-link-danger border border-0"
          >
            {" "}
            {processing[USER_ACTIONS.DELETE_MINUTE].status &&
            processing[USER_ACTIONS.DELETE_MINUTE].id ===
              props?.attachment?._id ? (
              <Spinner size="sm" />
            ) : (
              <i className="ims-icons-20 icon-icon-trash-24" />
            )}
          </TooltipButton>
        )}
    </>
  );
};

export default AgendaButtons;
