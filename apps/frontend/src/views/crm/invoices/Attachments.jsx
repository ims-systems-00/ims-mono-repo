import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import React, { useContext } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { deleteAttachmnet } from "@/services/customerService";
import { deleteFileFromS3, downloadFile } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "./actions";
import { CRMActionsContext } from "./context/CRMActionsContext";
const Attachments = ({ attachment }) => {
  let notify = React.useContext(NotificationContext);
  let { processing, dispatch, customer, refreshCustomer } =
    useContext(CRMActionsContext);
  async function handleTableButton(e) {
    try {
      dispatch({
        [USER_ACTIONS.REMOVE_ATTACHMENT]: {
          status: true,
          error: false,
          id: attachment._id,
        },
      });
      let { data } = await deleteAttachmnet(customer._id, attachment._id);
      await deleteFileFromS3(attachment.key || attachment.Key);
      refreshCustomer(data.customer);
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
  let key = attachment.key || attachment.Key;

  return (
    <>
      <span>{attachment?.Name} </span>
      <span
        style={{ cursor: "pointer" }}
        key={attachment._id}
        onClick={() => downloadFile(attachment)}
        className="text-info"
      >
        Download{" "}
      </span>
      {authUser({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW,
      }) && (
        <span
          style={{ cursor: "pointer" }}
          onClick={handleTableButton}
          className="text-danger"
        >
          {processing[USER_ACTIONS.REMOVE_ATTACHMENT].status &&
          processing[USER_ACTIONS.REMOVE_ATTACHMENT].id === attachment._id
            ? "Deleting..."
            : "Delete"}
        </span>
      )}
      <br></br>
    </>
  );
};

export default Attachments;
