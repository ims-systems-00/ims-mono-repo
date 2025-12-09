import TooltipButton from "@/components/Tooltip/TooltipButton";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { removeEvidence } from "@/services/complianceToolsServices";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { ComplianceActionsContext } from "./contexts/ComplianceActionsContext";

const ClauseEvidences = ({ ...props }) => {
  let attachment = props?.attachment;
  let notify = React.useContext(NotificationContext);
  let { authSuperUser, entityAccessControl } = useAccess();
  let { processing, setProcessing, clauseTool, refreshClause } = useContext(
    ComplianceActionsContext
  );
  let { alert, warningWithConfirmMessage } = useAlerts();
  async function handleTableButton(e) {
    try {
      setProcessing({ action: "delete-attachment", id: attachment._id });
      let { data } = await removeEvidence(clauseTool._id, attachment._id);
      await deleteFileFromS3(attachment.key || attachment.Key);
      refreshClause(data.control);
      notify("Evidence deleted successfully", "success");
    } catch (ex) {
      imsLogger("ClauseEvidences", ex.response || ex);
      notify("Evidence delete failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  }
  return (
    <>
      {alert}
      {(authSuperUser() ||
        entityAccessControl({
          users: [attachment?.modified?.by?._id],
          effect: "Allow",
        })) && (
        <TooltipButton
          tooltip="Delete"
          onClick={(e) => {
            warningWithConfirmMessage("This evidence will be deleted", () => {
              handleTableButton();
            });
          }}
          name="delete"
          size="sm"
          id="delete"
          color="link"
          className="btn-link-danger border border-0"
        >
          {processing.action === "delete-attachment" &&
          processing.id === attachment._id ? (
            <Spinner size="sm" />
          ) : (
            <i className="ims-icons-20 icon-icon-trash-24" />
          )}
        </TooltipButton>
      )}
      <br></br>
    </>
  );
};

export default ClauseEvidences;
