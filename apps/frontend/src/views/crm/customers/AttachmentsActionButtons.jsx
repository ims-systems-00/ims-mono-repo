import TooltipButton from "@/components/Tooltip/TooltipButton";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { deleteAttachmnet } from "@/services/customerService";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "./actions";
import { useCRM } from "./store";
const AttachmentsActionButtons = ({ ...props }) => {
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage } = useAlerts();
  let { processing, dispatch, visitingCustomer, visitCustomer } = useCRM();
  async function handleTableButton(attachment) {
    try {
      dispatch({
        [USER_ACTIONS.REMOVE_ATTACHMENT]: {
          status: true,
          error: false,
          id: attachment._id,
        },
      });
      let { data } = await deleteAttachmnet(
        visitingCustomer._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitCustomer(data.customer);
      notify("Document deleted successfully", "success");
    } catch (ex) {
      imsLogger("Contracts", ex.response || ex);
      notify("Document delete failed.Unknown server error occurred", "danger");
    }
    dispatch({
      [USER_ACTIONS.REMOVE_ATTACHMENT]: {
        status: false,
        error: false,
        id: null,
      },
    });
  }
  let { authUser } = useAccess();

  return (
    <React.Fragment>
      {alert}
      {authUser({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW,
      }) && (
        <TooltipButton
          onClick={(e) => {
            warningWithConfirmMessage("This attachment will be deleted", () => {
              handleTableButton(props?.attachment);
            });
          }}
          disabled={
            processing.action === "delete-attachment" &&
            processing.id === props?.attachment?._id
          }
          name="delete"
          size="sm"
          id="delete"
          color="link"
          tooltip="Delete"
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

export default AttachmentsActionButtons;
