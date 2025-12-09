import Loading from "@/components/Loader/Loading";
import useDualStateController from "@/hooks/useDualStateController";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import { downloadFile } from "@/services/fileHandlerService";
import { DocumentContextProvider, useDocument } from "../document/store";
import FolderForm from "./FolderForm";
import FolderNavigator from "./folderNavigator/Index";
import ShareDocumentForm from "./ShareDocumentForm";
import USER_ACTIONS from "./store/actions";
import useRepository from "./store/useRepository";
import UploadFileForm from "./UploadFileForm";
import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";
import { RepositoryContextProvider } from "./store";

const AddVersion = ({ onSubmit = () => {} }) => {
  const { document, toolKits, uploadNewVersion } = useDocument();
  return (
    <React.Fragment>
      {document ? (
        <UploadFileForm
          node={document}
          toolKits={toolKits}
          noMultiple
          onSubmit={async (data) => {
            await uploadNewVersion(data);
            onSubmit();
          }}
        />
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

const NodeActions = ({ node }) => {
  let { isOpen: isActionOpen, toggle: toggleActions } =
    useDualStateController();
  let { isOpen: isFolderNavOpen, toggle: toggleFolderNav } =
    useDualStateController();
  let { isOpen: isShareOpen, toggle: toggleShare } = useDualStateController();
  let { isOpen: isRenameOpen, toggle: toggleRename } = useDualStateController();
  let { isOpen: isVersionFormOpen, toggle: toggleVersionForm } =
    useDualStateController();
  const {
    processing,
    softDeleteNode,
    loadChildDetails,
    shareDocument,
    restoreNode,
    hardDeleteNode,
    repository,
    visitNode,
    moveNode,
    renameFolder,
    hasOwnership,
  } = useRepository();
  const history = useHistory();
  return (
    <React.Fragment>
      <Dropdown size="sm" isOpen={isActionOpen} toggle={toggleActions}>
        <DropdownToggle data-display="static" className="btn-icon ml-auto">
          <i className="fa-solid fa-ellipsis-vertical three-dots"></i>
        </DropdownToggle>
        <DropdownMenu right>
          {!node?.deleteMarker?.status && (
            <>
              {node?.type === "folder" && (
                <React.Fragment>
                  <DropdownItem
                    disabled={processing[USER_ACTIONS.SOFT_DELETE_NODE].status}
                    onClick={() => visitNode(node?._id)}
                  >
                    <i className="fa-solid fa-folder-open" /> Open folder
                  </DropdownItem>
                  <Can
                    policy={{
                      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                      action: ACTIONS.UPDATE,
                    }}
                  >
                    <DropdownItem onClick={() => toggleRename()}>
                      <i className="fa-solid fa-edit" /> Rename
                    </DropdownItem>
                  </Can>
                  <Modal isOpen={isRenameOpen} toggle={toggleRename}>
                    <ModalBody>
                      <FolderForm
                        node={node}
                        onSubmit={async (data) => {
                          await renameFolder(data);
                          toggleRename();
                        }}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        size="sm"
                        color="danger"
                        className=" btn-block ml-auto"
                        onClick={toggleRename}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </React.Fragment>
              )}
              {node?.type === "document" && (
                <React.Fragment>
                  <DropdownItem
                    disabled={processing[USER_ACTIONS.SOFT_DELETE_NODE].status}
                    onClick={() =>
                      history.push(
                        `/admin/document-repositories/${repository?._id}/nodes/${node?._id}`
                      )
                    }
                  >
                    <i className="fa-solid fa-file" /> View document
                  </DropdownItem>
                  <Can
                    policy={{
                      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                      action: ACTIONS.CREATE,
                    }}
                  >
                    {hasOwnership(node) && (
                      <DropdownItem onClick={toggleVersionForm}>
                        <i className="fa-solid fa-plus" /> Add new version
                      </DropdownItem>
                    )}
                  </Can>
                  <Modal isOpen={isVersionFormOpen} toggle={toggleVersionForm}>
                    <ModalBody>
                      <DocumentContextProvider
                        repoId={node?.repository?._id}
                        docId={node?._id}
                      >
                        <AddVersion onSubmit={toggleVersionForm} />
                      </DocumentContextProvider>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        size="sm"
                        color="danger"
                        className=" btn-block ml-auto"
                        onClick={toggleVersionForm}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>
                </React.Fragment>
              )}
              <DropdownItem
                disabled={processing[USER_ACTIONS.SOFT_DELETE_NODE].status}
                onClick={() => loadChildDetails(node)}
              >
                <i className="fa-solid fa-circle-info" /> View Details
              </DropdownItem>
              <Can
                policy={{
                  service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                  action: ACTIONS.UPDATE,
                }}
              >
                {hasOwnership(node) && (
                  <DropdownItem
                    disabled={processing[USER_ACTIONS.SOFT_DELETE_NODE].status}
                    onClick={async () => await toggleFolderNav()}
                  >
                    <i className="fa-solid fa-file-export" /> Move to
                  </DropdownItem>
                )}
                <Modal isOpen={isFolderNavOpen} toggle={toggleFolderNav}>
                  <ModalBody>
                    <FolderNavigator
                      node={node}
                      onMoveSubmit={async (selectionNode, movetoNode) => {
                        await moveNode(selectionNode?._id, movetoNode?._id);
                        toggleFolderNav();
                      }}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      size="sm"
                      color="danger"
                      className=" btn-block ml-auto"
                      onClick={toggleFolderNav}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </Modal>
              </Can>
              {node.type === "document" && (
                <Can
                  policy={{
                    service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                    action: ACTIONS.UPDATE,
                  }}
                >
                  <DropdownItem
                    onClick={() =>
                      downloadFile(node?.documentData?.storageInfo)
                    }
                  >
                    <i className="fa-solid fa-download" /> Download
                  </DropdownItem>
                  <DropdownItem
                    disabled={processing[USER_ACTIONS.SOFT_DELETE_NODE].status}
                    onClick={() => toggleShare()}
                  >
                    <i className="fa-solid fa-share" /> Share
                  </DropdownItem>
                  <Modal isOpen={isShareOpen} toggle={toggleShare}>
                    <ModalBody>
                      <ShareDocumentForm
                        onSubmit={(data) => {
                          shareDocument(node?._id, data);
                        }}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        size="sm"
                        color="danger"
                        className=" btn-block ml-auto"
                        onClick={toggleShare}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Can>
              )}
              {hasOwnership(node) && (
                <DropdownItem
                  disabled={processing[USER_ACTIONS.SOFT_DELETE_NODE].status}
                  onClick={() => softDeleteNode(node._id)}
                >
                  <i className="fa-solid fa-trash-can" /> Move to recycle bin
                </DropdownItem>
              )}
            </>
          )}
          {node?.deleteMarker?.status && (
            <Can
              policy={{
                service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                action: ACTIONS.UPDATE,
              }}
            >
              <DropdownItem
                disabled={processing[USER_ACTIONS.SOFT_DELETE_NODE].status}
                onClick={() => restoreNode(node?._id)}
              >
                <i className="fa-solid fa-rotate" /> Restore
              </DropdownItem>
              <DropdownItem
                disabled={processing[USER_ACTIONS.SOFT_DELETE_NODE].status}
                onClick={() => {
                  hardDeleteNode(node?._id);
                }}
              >
                <i className="fa-solid fa-trash-can" /> Delete permanently
              </DropdownItem>
            </Can>
          )}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NodeActions;
