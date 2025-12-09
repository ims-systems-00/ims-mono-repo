import TooltipButton from "@/components/Tooltip/TooltipButton";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { deleteToolEvidence } from "@/services/cqcServices";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { ToolActionsContext } from "./context/ToolActionsContext";

const ToolEvidences = ({ ...props }) => {
  let notify = React.useContext(NotificationContext);
  let { authUser } = useAccess();
  let { processing, setProcessing, toolControl, refreshControl } =
    useContext(ToolActionsContext);
  let { alert, warningWithConfirmMessage } = useAlerts();
  async function handleTableButton(evidence) {
    try {
      setProcessing({ action: "delete-evidence", id: evidence._id });
      let { data } = await deleteToolEvidence(toolControl._id, evidence._id);
      await deleteFileFromS3(evidence.key || evidence.Key);
      refreshControl(data.control);
      notify("Document deleted successfully", "success");
    } catch (ex) {
      imsLogger("CQCSitesToolEvidences", ex.response || ex);
      notify("Document delete failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  }
  return (
    <>
      {alert}
      {authUser({
        service: IMS_SERVICES.CQC,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW,
      }) && (
        <TooltipButton
          tooltip="Delete"
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
          // className="btn-icon  like btn-danger"
          color="link"
          outline
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
    </>
  );
};

export default ToolEvidences;
