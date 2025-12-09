import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import React from "react";
import { Link } from "react-router-dom";
import {
  hardDeleteNode,
  restoreNode,
  softDeleteNode,
} from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "@/views/documentManagement/actions";
import useRepository from "../store/repository/useRepository";

const DocumentOptions = ({
  event,
  handleCloseDropdown,
  handleDocData,
  handleMoveDropdown,
  handleSelectedRow,
  dropdownRef,
  toggleRepoModal,
  handleFilter,
  setNodeLists,
  processing,
  dispatch,
  addToTrashedNodes,
  setTrashedNodeList,
  ...props
}) => {
  let { entityAccessControl } = useAccess();
  const signExtensions = ["doc", "docx", "pdf"];
  const repoId = props.match && props.match.params.id;
  const { visitingNode } = useRepository();
  const _handleEnterIntoNode = (node) => {
    handleFilter({
      value: {
        parentNode: node._id || null,
        status: "Published",
      },
    });
    if (node?.type === "document") {
      let data = {
        ...node?.documentData.storageInfo,
        _id: node?._id,
      };
      handleDocData(data);
    }
  };

  const handleCheckFileType = (file) => {
    let splited = file.name.split(".");
    let extension = splited[splited.length - 1];
    extension = extension.toLowerCase();
    return signExtensions.includes(extension);
  };

  let notify = React.useContext(NotificationContext);

  const _softDeleteDocument = async (delData) => {
    try {
      dispatch({
        [USER_ACTIONS.SOFT_DELETE_NODE]: {
          status: true,
          error: false,
          id: visitingNode?._id,
        },
      });
      let { data } = await softDeleteNode(
        visitingNode?.repository?._id,
        visitingNode?._id
      );
      addToTrashedNodes(data.node);
      setNodeLists((prevNodes) =>
        prevNodes.filter((node) => node._id !== delData._id)
      );
      notify(`${data?.node.reference} deleted successfully`, "success");
      // popUpAlerts(`Entity deleted successfully.`, {
      //   icon: "",
      // });
      dispatch({
        [USER_ACTIONS.SOFT_DELETE_NODE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.SOFT_DELETE_NODE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("DocumentOptions", ex);
      notify("Document could not be deleted", "danger");
    }
  };
  const _hardDeleteDocument = async (delData) => {
    try {
      dispatch({
        [USER_ACTIONS.HARD_DELETE_NODE]: {
          status: true,
          error: false,
          id: visitingNode?._id,
        },
      });
      let { data } = await hardDeleteNode(
        visitingNode?.repository?._id,
        visitingNode?._id
      );
      setTrashedNodeList((prevNodes) =>
        prevNodes.filter((node) => node._id !== delData._id)
      );
      notify(`${data?.node.reference} deleted successfully`, "success");
      dispatch({
        [USER_ACTIONS.HARD_DELETE_NODE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.HARD_DELETE_NODE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("DocumentOptions", ex);
      notify("Document could not be deleted", "danger");
    }
  };

  // restore document
  const _restoreDeleteDocument = async (delData) => {
    try {
      dispatch({
        [USER_ACTIONS.RESTORE_NODE]: {
          status: true,
          error: false,
          id: visitingNode?._id,
        },
      });
      let { data } = await restoreNode(
        visitingNode?.repository?._id,
        visitingNode?._id
      );
      setNodeLists((prevNodes) => [data.node, ...prevNodes]);
      setTrashedNodeList((prevNodes) =>
        prevNodes.filter((node) => node._id !== delData._id)
      );
      notify(`${data?.node.reference} deleted successfully`, "success");
      dispatch({
        [USER_ACTIONS.RESTORE_NODE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.RESTORE_NODE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("DocumentOptions", ex);
      notify("Document could not be deleted", "danger");
    }
  };
  let { alert } = useAlerts();

  return (
    <>
      {alert}
      <>
        <ul
          ref={dropdownRef}
          className="doc-options-container"
          style={{
            top:
              event.pageY > window.innerHeight
                ? event.pageY - 200
                : event.pageY,
            left:
              event.pageX > window.innerWidth - 200
                ? event.pageX - 200
                : event.pageX,
          }}
        >
          {!visitingNode?.deleteMarker?.status ? (
            <>
              {visitingNode?.type !== "folder" && (
                <>
                  <li id="preview-doc">
                    <Link
                      to={`/admin/document-repositories/${visitingNode?.repository?._id}/nodes/${visitingNode?._id}/signatures`}
                      className="text-dark"
                    >
                      <i className="fa-solid fa-eye me-3"></i>
                      Preview
                    </Link>
                  </li>

                  <li
                    id="share-doc"
                    onClick={() => {
                      toggleRepoModal("Share");
                      handleCloseDropdown();
                    }}
                  >
                    <i className="ims-icons-20 icon-share-regular  me-3"></i>
                    Share
                  </li>
                  <>
                    {(visitingNode?.status === "Published" ||
                      visitingNode?.status === "Archived") &&
                      handleCheckFileType(visitingNode) && (
                        <>
                          {entityAccessControl({
                            users: [
                              visitingNode?.created?.by?._id,
                              visitingNode?.repository?.created?.by,
                              visitingNode?.repository?.owner,
                            ],
                            effect: "Allow",
                          }) && (
                            <li
                              onClick={() => {
                                toggleRepoModal("addSignee");
                                handleCloseDropdown();
                              }}
                            >
                              {/* Add Signee */}
                              <Link
                                to={`/admin/document-repositories/${repoId}/nodes/${visitingNode?._id}/signee`}
                                className="text-dark"
                              >
                                <i className="ims-icons-20 icon-members-regular  me-3"></i>
                                Add Signee
                              </Link>
                            </li>
                          )}
                        </>
                      )}
                  </>
                </>
              )}
              {!visitingNode?.deleteMarker?.status && (
                <>
                  {visitingNode?.type === "folder" && (
                    <>
                      <li
                        id="view-folder"
                        onClick={() => {
                          _handleEnterIntoNode(visitingNode);
                          handleCloseDropdown();
                        }}
                      >
                        <i className="fa-solid fa-eye me-3"></i>
                        View Folder
                      </li>
                      {entityAccessControl({
                        users:
                          [
                            visitingNode?.created?.by?._id,
                            visitingNode?.repository?.created?.by,
                            visitingNode?.repository?.owner,
                          ] || [],
                        effect: "Allow",
                      }) && (
                        <li
                          id="rename-doc"
                          onClick={() => {
                            toggleRepoModal("Rename");
                            handleCloseDropdown();
                          }}
                        >
                          <i className="ims-icons-20 icon-rename-regular  me-3"></i>
                          Rename
                        </li>
                      )}
                    </>
                  )}
                  {entityAccessControl({
                    users:
                      [
                        visitingNode?.created?.by?._id,
                        visitingNode?.repository?.created?.by,
                        visitingNode?.repository?.owner,
                      ] || [],
                    effect: "Allow",
                  }) && (
                    <li
                      id="move-doc"
                      onClick={() => {
                        handleMoveDropdown(true);
                        handleCloseDropdown();
                      }}
                    >
                      <i className="ims-icons-20 icon-move-regular  me-3"></i>
                      Move to
                    </li>
                  )}
                </>
              )}
            </>
          ) : null}

          {visitingNode?.deleteMarker?.status && (
            <>
              {entityAccessControl({
                users:
                  [
                    visitingNode?.created?.by?._id,
                    visitingNode?.repository?.created?.by,
                    visitingNode?.repository?.owner,
                  ] || [],
                effect: "Allow",
              }) && (
                <li
                  id="restore-doc"
                  onClick={() => {
                    _restoreDeleteDocument(visitingNode);
                    handleCloseDropdown();
                  }}
                >
                  <i className="ims-icons-20 icon-back-regular  me-3"></i>
                  Restore
                </li>
              )}
            </>
          )}
          {entityAccessControl({
            users:
              [
                visitingNode?.created?.by?._id,
                visitingNode?.repository?.created?.by,
                visitingNode?.repository?.owner,
              ] || [],
            effect: "Allow",
          }) && (
            <li
              id="remove-doc"
              onClick={() => {
                if (visitingNode?.deleteMarker?.status) {
                  _hardDeleteDocument(visitingNode);
                } else {
                  _softDeleteDocument(visitingNode);
                }
                handleSelectedRow(null);
                handleCloseDropdown();
              }}
            >
              <i className="ims-icons-20 icon-icon-trash-24  me-3"></i>
              {visitingNode?.deleteMarker?.status ? "Delete" : "Move to trash"}
            </li>
          )}
        </ul>
      </>
    </>
  );
};

export default DocumentOptions;
