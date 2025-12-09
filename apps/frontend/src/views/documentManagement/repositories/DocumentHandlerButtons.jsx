import React from "react";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import NotificationContext from "@/contexts/notificationContext";
import { deleteDocumentFromRepository } from "@/services/documentManagement/index";
import useAccess from "@/hooks/useAccess";
import { imsLogger } from "@/services/loggerService";
import useModal from "@/hooks/useModal";
import USER_ACTIONS from "../actions";
import useAlerts from "@/hooks/useAlerts";
import Document from "../document/Index";
import TooltipButton from "@/components/Tooltip/TooltipButton";

const DocumentHandlerButtons = ({
  repository,
  setDocuments,
  processing,
  dispatch,
  ...props
}) => {
  let { entityAccessControl } = useAccess();
  let { activateView, Modal } = useModal({});
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage } = useAlerts();
  async function handleDeleteDocument(document) {
    try {
      dispatch({
        [USER_ACTIONS.DELETE_DOCUMENT]: {
          status: true,
          error: false,
          id: document._id,
        },
      });
      let { data } = await deleteDocumentFromRepository(
        repository._id,
        document._id
      );
      setDocuments((prevDocuments) =>
        prevDocuments.filter((document) => document._id !== data.document._id)
      );
      notify(`${data?.document?.reference} deleted successfully`, "success");
      dispatch({
        [USER_ACTIONS.DELETE_DOCUMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.DELETE_DOCUMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex);
      notify(`${ex?.response?.data?.message}`, "danger");
    }
  }
  return (
    <>
      {alert}{" "}
      <TooltipButton
        onClick={() => {
          activateView(props.attachment?.document);
        }}
        color="info"
        size="sm"
        id="detail"
        tooltip="View Details"
        className="btn-icon  like btn-info"
      >
        <i className="fas fa-eye" />
      </TooltipButton>{" "}
      {entityAccessControl({
        users: [repository?.created?.by?._id, repository?.owner?._id],
        effect: "Allow",
      }) &&
        props.attachment?.document?.status !== "Pending" && (
          <TooltipButton
            tooltip="Delete"
            onClick={(e) => {
              warningWithConfirmMessage("This document will be deleted", () => {
                handleDeleteDocument(props?.attachment?.document);
              });
            }}
            name="delete"
            // color="danger"
            size="sm"
            id="delete"
            // className="btn-icon  like btn-danger"
            color="link"
            outline
            className="btn-link-danger border border-0"
          >
            {processing[USER_ACTIONS.DELETE_DOCUMENT].status &&
            processing[USER_ACTIONS.DELETE_DOCUMENT].id ===
              props.attachment?.document?._id ? (
              <Spinner size="sm" />
            ) : (
              <i className="ims-icons-20 icon-icon-trash-24" />
            )}
          </TooltipButton>
        )}
      <Modal title="Document">
        <Document repository={repository} fetchData={props.fetchData} />
      </Modal>
    </>
  );
};
export default DocumentHandlerButtons;
