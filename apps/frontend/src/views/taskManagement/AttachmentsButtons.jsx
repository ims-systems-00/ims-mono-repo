import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAlerts from "@/hooks/useAlerts";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import USER_ACTIONS from "./actions";
import { useTask } from "./store";

const AttachmentsButtons = ({ ...props }) => {
  let { alert, warningWithConfirmMessage } = useAlerts();
  let { isCompletedTask, processing, task, handleDeleteAttachments } =
    useTask();

  return (
    <React.Fragment>
      {alert}
      {!isCompletedTask(task) && (
        // authUser({
        //   service: IMS_SERVICES.TASK_MANAGER,
        //   action: ACTIONS.DELETE,
        //   effect: EFFECTS.ALLOW,
        // }) &&
        <TooltipButton
          onClick={(e) => {
            warningWithConfirmMessage("This attachment will be deleted", () => {
              handleDeleteAttachments(props?.attachment);
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
          tooltip="Delete"
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
        </TooltipButton>
      )}
    </React.Fragment>
  );
};

export default AttachmentsButtons;
