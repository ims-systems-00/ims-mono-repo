import TooltipButton from "@/components/Tooltip/TooltipButton";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { deleteSignificantEventAttachment } from "@/services/cqcServices";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { SignificantEventActionsContext } from "./context/SignificantEventActionsContext";
import useSignificantEvent from "./hooks/useSignificantEvent";

const SignificantEventAttachments = ({ ...props }) => {
  let { isClosedSignificantEvent } = useSignificantEvent();
  let { authUser } = useAccess();
  let notify = useContext(NotificationContext);
  let { significantEvent, setProcessing, processing, refreshSignificantEvent } =
    useContext(SignificantEventActionsContext);
  let { alert, warningWithConfirmMessage } = useAlerts();
  async function handleTableButton(attachment) {
    try {
      setProcessing({ action: "delete-attachment", id: attachment._id });
      let { data } = await deleteSignificantEventAttachment(
        significantEvent._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      refreshSignificantEvent && refreshSignificantEvent(data.significantEvent);
      notify("Attachment deleted successfully", "success");
    } catch (ex) {
      imsLogger("SignificantEventAttachments", ex.response || ex);
      notify(
        "Attachment delete failed. Unknown server error occurred",
        "danger"
      );
    }
    setProcessing({ action: null, id: null });
  }
  return (
    <>
      {alert}
      {!isClosedSignificantEvent(significantEvent) &&
        authUser({
          service: IMS_SERVICES.CQC,
          action: ACTIONS.DELETE,
          effect: EFFECTS.ALLOW,
        }) && (
          <TooltipButton
            tooltip="Delete"
            onClick={(e) => {
              warningWithConfirmMessage(
                "This attachment will be deleted",
                () => {
                  handleTableButton(props?.attachment);
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
            // className="btn-icon  like btn-danger"
            color="danger"
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
    </>
  );
};

export default SignificantEventAttachments;
