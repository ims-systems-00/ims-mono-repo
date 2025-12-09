import TooltipButton from "@/components/Tooltip/TooltipButton";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import useAccess from "@/hooks/useAccess";
import { useRisk } from "./store";

const AttachmentButtons = (props) => {
  let {
    isMitigatedRisk,
    processing,
    warningWithConfirmMessage,
    handleRiskAttachment,
    visitingRisk: risk,
  } = useRisk();
  let { authUser } = useAccess();

  return (
    <React.Fragment>
      {!isMitigatedRisk(risk) &&
        authUser({
          service: IMS_SERVICES.RISK_MANAGEMENT,
          action: ACTIONS.DELETE,
          effect: EFFECTS.ALLOW,
        }) && (
          <TooltipButton
            tooltip="Delete"
            onClick={(e) => {
              warningWithConfirmMessage(
                "This attachment will be deleted",
                () => {
                  handleRiskAttachment(props?.attachment, risk);
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
