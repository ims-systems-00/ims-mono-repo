import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import { Button, Spinner } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { useCip } from "./store";

const AttachmentsButtons = ({ ...props }) => {
  let {
    processing,
    isImplementedCip,
    visitingCip: cip,
    handleCipAttachment,
  } = useCip();
  let { authUser } = useAccess();
  let notify = useContext(NotificationContext);
  let { alert, warningWithConfirmMessage } = useAlerts();

  return (
    <React.Fragment>
      {alert}
      {!isImplementedCip(cip) &&
        authUser({
          service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
          action: ACTIONS.DELETE,
          effect: EFFECTS.ALLOW,
        }) && (
          <Button
            tooltip="Delete"
            onClick={(e) => {
              warningWithConfirmMessage(
                "This attachment will be deleted",
                () => {
                  handleCipAttachment(props?.attachment);
                }
              );
            }}
            disabled={
              processing.action === "delete-attachment" &&
              processing.id === props?.attachment?._id
            }
            name="delete"
            size="sm"
            id="delete"
            className="btn-link-danger border border-0"
            color="link"
          >
            {" "}
            {processing.action === "delete-attachment" &&
            processing.id === props?.attachment?._id ? (
              <Spinner size="sm" />
            ) : (
              <i className="ims-icons-20 icon-icon-trash-24" />
            )}
          </Button>
        )}
    </React.Fragment>
  );
};

export default AttachmentsButtons;
