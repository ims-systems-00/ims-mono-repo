import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index";
import useUrlSearchParams from "@/hooks/useUrlSearchParams";
import { useContext, useEffect, useState } from "react";
import * as documentManagmentApi from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "./actions";
import { useApplication } from "@/stores/applicationStore";
export default function useRepositoryStore(config) {
  const { currentUserData } = useApplication();
  const { query: urlSearchQuery, setSearch } = useUrlSearchParams();
  const [hasPendingAuthorisation, setHasPendingAuthorisation] = useState(false);
  const [firstRenderComplete, setFirstRenderComplete] = useState(false);
  const [hasPendingSignature, setHasPendingSignature] = useState(false);
  const [repository, setRespository] = useState(null);
  const [visitingNode, setVisitingNode] = useState(null);
  const [visitingNodePath, setVisitingNodePath] = useState([]);
  const [visitingNodeChildren, setVisitingNodeChildren] = useState([]);
  const [detailsOfSelectedChild, setDetailsOfSelectedChild] = useState(null);
  const [totalFiles, setTotalFiles] = useState(0);
  const notify = useContext(NotificationContext);
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    }),
  );
  let vistingNodeChildrenQueryUtils = useQuery({
    required: {
      value: { deleteMarker: { status: false }, status: "Published" },
    },
    filter: {
      value: {
        parentNode: null,
        sort: "-type name",
      },
    },
  });
  async function _loadNode(id) {
    setSearch("node=" + (id || ""));
    if (id) {
      try {
        _dispatch({
          [USER_ACTIONS.LOAD_NODE]: {
            status: true,
            error: false,
            id: null,
          },
        });
        let { data } = await documentManagmentApi.getNode(config.repoId, id);
        setVisitingNode(data.node);
        _dispatch({
          [USER_ACTIONS.LOAD_NODE]: {
            status: false,
            error: false,
            id: null,
          },
        });
      } catch (err) {
        imsLogger(err, err.message);
        _dispatch({
          [USER_ACTIONS.LOAD_NODE]: {
            status: false,
            error: true,
            id: null,
          },
        });
      }
    } else setVisitingNode(null);
  }
  async function _loadVisitingNodePath(id) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_NODE_PATH]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.getNodePath(config.repoId, id);
      setVisitingNodePath(data.path);
      _dispatch({
        [USER_ACTIONS.LOAD_NODE_PATH]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.LOAD_NODE_PATH]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(err, err.message);
    }
  }
  async function _loadVisitingNodeChildren(query) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_CHILD_NODES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.listRepoNodeItems(
        config.repoId,
        {
          query,
        },
      );
      if (data.pagination?.currentPage === 1)
        setVisitingNodeChildren(data.nodes || []);
      else
        setVisitingNodeChildren((prevChildren) => [
          ...prevChildren,
          ...data.nodes,
        ]);
      if (data.pagination?.hasNextPage) {
        vistingNodeChildrenQueryUtils.handlePagination({
          page: data.pagination.nextPage,
        });
      }
      _dispatch({
        [USER_ACTIONS.LOAD_CHILD_NODES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.LOAD_CHILD_NODES]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function _loadRepository() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_REPOSITORY]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.getRepository(config.repoId);
      setRespository(data.repository);
      setTotalFiles(data.totalDocumentNodes);
      _dispatch({
        [USER_ACTIONS.LOAD_REPOSITORY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.LOAD_REPOSITORY]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(err, err.message);
    }
  }
  async function _checkHasPendingAuthorisation() {
    try {
      let { data } = await documentManagmentApi.listRepoNodeItems(
        config.repoId,
        {
          query: `type=document&status=Pending&documentData[authorisation][user]=${currentUserData?._id}&documentData[authorisation][status]=Pending&deleteMarker[status]=false`,
        },
      );
      if (
        data?.nodes?.length &&
        data?.nodes?.find((node) =>
          node?.documentData?.authorisation?.find(
            (auth) =>
              auth.user?._id === currentUserData?._id &&
              auth?.status === "Pending",
          ),
        )
      )
        setHasPendingAuthorisation(true);
    } catch (err) {
      imsLogger(err, err.message);
    }
  }
  async function _checkHasPendingSignatures() {
    try {
      let { data } = await documentManagmentApi.getSignatures({
        query: `user[internalRef]=${currentUserData?._id}&status=Pending&repository=${config.repoId}`,
      });
      if (data?.usersForSignature?.length) setHasPendingSignature(true);
    } catch (err) {
      imsLogger(err, err.message);
    }
  }
  function _removeFromVisitingNodeChildrenState(id) {
    setVisitingNodeChildren((prevchildren) =>
      prevchildren.filter((node) => node?._id !== id),
    );
  }
  function visitNode(id) {
    _loadNode(id);
    _loadVisitingNodePath(id || null);
    vistingNodeChildrenQueryUtils.handleFilter({
      value: {
        parentNode: id || null,
        sort: "-type name",
      },
    });

    setDetailsOfSelectedChild(null);
  }
  function visitParentNode() {
    visitNode(visitingNode?.parentNode || null);
  }
  function viewTrashBin() {
    vistingNodeChildrenQueryUtils.handleRequired({
      value: { deleteMarker: { status: true }, status: "Published" },
    });
    vistingNodeChildrenQueryUtils.handleFilter({
      value: {
        sort: "-type name",
      },
    });
  }
  function viewAuthorisationRequest(id) {
    vistingNodeChildrenQueryUtils.handleRequired({
      value: {
        deleteMarker: { status: false },

        status: "Pending",
        documentData: {
          authorisation: { user: id, status: "Pending" },
        },
      },
    });
    vistingNodeChildrenQueryUtils.handleFilter({
      value: {
        sort: { createdAt: -1 },
      },
    });
  }
  function viewPendingApproval(id) {
    vistingNodeChildrenQueryUtils.handleRequired({
      value: {
        deleteMarker: { status: false },

        status: "Pending",
        documentData: {
          authorisation: { status: "Pending" },
        },
        created: {
          by: id,
        },
      },
    });
    vistingNodeChildrenQueryUtils.handleFilter({
      value: {
        sort: { createdAt: -1 },
      },
    });
  }
  function backToNormalView() {
    vistingNodeChildrenQueryUtils.handleRequired({
      value: { deleteMarker: { status: false }, status: "Published" },
    });
    vistingNodeChildrenQueryUtils.handleFilter({
      value: {
        parentNode: null,
        sort: "-type name",
      },
    });
  }
  async function loadChildDetails(childNode) {
    if (childNode?._id) {
      setDetailsOfSelectedChild(childNode);
    }
  }
  async function amendRepository(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_REPOSITORY]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.updateRepository(
        config.repoId,
        payload,
      );
      _loadRepository();
      notify("Repository information updated successfully", "success");
      _dispatch({
        [USER_ACTIONS.AMEND_REPOSITORY]: {
          status: true,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      notify(err.message || "Server error occured, please try again later.");
      _dispatch({
        [USER_ACTIONS.AMEND_REPOSITORY]: {
          status: true,
          error: false,
          id: null,
        },
      });
    }
  }
  async function softDeleteNode(id) {
    try {
      _dispatch({
        [USER_ACTIONS.SOFT_DELETE_NODE]: {
          status: true,
          error: false,
          id: id,
        },
      });
      const { data } = await documentManagmentApi.softDeleteNode(
        config.repoId,
        id,
      );
      _removeFromVisitingNodeChildrenState(id);
      _dispatch({
        [USER_ACTIONS.SOFT_DELETE_NODE]: {
          status: false,
          error: false,
          id: null,
        },
      });
      notify(
        data?.node?.name + " moved to recycle bin successfully.",
        "success",
      );
    } catch (err) {
      imsLogger(err, err.response);
      _dispatch({
        [USER_ACTIONS.SOFT_DELETE_NODE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify(
        err.response?.data?.message || "Server error, please try again later",
        "danger",
      );
    }
  }
  async function hardDeleteNode(id) {
    try {
      _dispatch({
        [USER_ACTIONS.HARD_DELETE_NODE]: {
          status: true,
          error: false,
          id: id,
        },
      });
      await documentManagmentApi.hardDeleteNode(config.repoId, id);
      _removeFromVisitingNodeChildrenState(id);
      _dispatch({
        [USER_ACTIONS.HARD_DELETE_NODE]: {
          status: false,
          error: false,
          id: null,
        },
      });
      notify("Document deleted permanently.", "success");
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.HARD_DELETE_NODE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function restoreNode(id) {
    try {
      _dispatch({
        [USER_ACTIONS.RESTORE_NODE]: {
          status: true,
          error: false,
          id: id,
        },
      });
      const { data } = await documentManagmentApi.restoreNode(
        config.repoId,
        id,
      );
      _removeFromVisitingNodeChildrenState(id);
      _dispatch({
        [USER_ACTIONS.RESTORE_NODE]: {
          status: false,
          error: false,
          id: null,
        },
      });
      notify(data?.node?.name + " restored successfully.", "success");
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.RESTORE_NODE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify(
        err.response?.data?.message || "Server error, please try again later",
        "danger",
      );
    }
  }
  async function moveNode(id, moveto = null) {
    try {
      _dispatch({
        [USER_ACTIONS.MOVE_NODE]: {
          status: true,
          error: false,
          id: id,
        },
      });
      let { data } = await documentManagmentApi.moveNode(
        config.repoId,
        id,
        moveto,
      );
      _removeFromVisitingNodeChildrenState(id);
      notify(`${data.node?.name} moved`, "success");
      _dispatch({
        [USER_ACTIONS.MOVE_NODE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      notify(err.response?.data?.message || err.message, "danger");
      _dispatch({
        [USER_ACTIONS.MOVE_NODE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function shareDocument(id, payload) {
    try {
      _dispatch({
        [USER_ACTIONS.SHARE_DOCUMENT]: {
          status: true,
          error: false,
          id: id,
        },
      });
      let { data } = await documentManagmentApi.shareDocument(
        config.repoId,
        id,
        payload,
      );
      notify(`${data.node?.name} shared via email`, "success");
      _dispatch({
        [USER_ACTIONS.SHARE_DOCUMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      notify(
        err.message || "Server error occured, please try again later.",
        "danger",
      );
      _dispatch({
        [USER_ACTIONS.SHARE_DOCUMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  function isBinActive() {
    return (
      vistingNodeChildrenQueryUtils.toolState?.required?.value?.deleteMarker
        ?.status || false
    );
  }
  function isViewingAuthorisation() {
    return (
      vistingNodeChildrenQueryUtils.toolState?.required?.value?.status ===
      "Pending"
    );
  }
  function getVisitingNodeFolders() {
    return visitingNodeChildren.filter((node) => node?.type === "folder");
  }
  function getVisitingNodeFiles() {
    return visitingNodeChildren.filter((node) => node?.type === "document");
  }
  function refreshCurretNodeChildrenList() {
    visitNode(visitingNode?._id);
  }
  async function createFolderNode(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_FOLDER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      const { data } = await documentManagmentApi.addFolder(
        payload,
        visitingNode?._id || null,
        config.repoId,
      );

      refreshCurretNodeChildrenList();
      _dispatch({
        [USER_ACTIONS.ADD_FOLDER]: {
          status: false,
          error: false,
          id: null,
        },
      });
      notify("Folder created successfully", "success");
    } catch (err) {
      imsLogger(err, err.message);
      notify(
        err.message || "Server error occured, please try again later.",
        "danger",
      );
      _dispatch({
        [USER_ACTIONS.ADD_FOLDER]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function createFileNode(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_FILE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.addFile(
        payload,
        visitingNode?._id || null,
        config.repoId,
      );
      if (payload.authorisation.length)
        notify("File sent for authorisation.", "success");
      else notify("File uploaded.", "success");

      refreshCurretNodeChildrenList();
      _dispatch({
        [USER_ACTIONS.ADD_FILE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      notify(
        err.message || "Server error occured, please try again later.",
        "danger",
      );
      _dispatch({
        [USER_ACTIONS.ADD_FILE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  function hasOwnership(document) {
    return (
      document?.created?.by?._id === currentUserData?._id ||
      repository.owners?.map((o) => o._id).includes(currentUserData?._id) ||
      document.documentData?.owners
        ?.map((o) => o._id)
        .includes(currentUserData?._id)
    );
  }
  function hasRepositoryOwnership(userid) {
    return repository.owners?.map((o) => o._id).includes(userid);
  }
  function isAllowedToUpload(data) {
    let flag = 0;
    for (let attachment of data.attachments) {
      if (
        visitingNodeChildren
          .filter((c) => c.type === "document")
          .map((c) => c.name)
          .includes(attachment?.Name)
      ) {
        flag = 1;
        notify(
          attachment?.Name +
            " already exists. Please upload a new version or remove the existing file.",
          "danger",
        );
      }
    }
    return flag;
  }
  async function renameFolder(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.RENAME_NODE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      const { data } = await documentManagmentApi.updateFolderNodeMetaData(
        config.repoId,
        payload?.nodeId || null,
        payload,
      );
      refreshCurretNodeChildrenList();
      _dispatch({
        [USER_ACTIONS.RENAME_NODE]: {
          status: false,
          error: false,
          id: null,
        },
      });
      notify("Folder renamed successfully", "success");
    } catch (err) {
      imsLogger(err, err.message);
      notify(
        err.message || "Server error occured, please try again later.",
        "danger",
      );
      _dispatch({
        [USER_ACTIONS.RENAME_NODE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  useEffect(() => {
    _loadRepository();
    visitNode(urlSearchQuery.get("node") || null);
  }, [config.repoId]);
  useEffect(() => {
    /**
     * when rendering the first time we want to ignore this fire because visit node is fired in
     * another useEffect block that actully is making a change in the query to fire this block.
     * and because this is a auto paginated fintion bellow, to avoid duplicate api call cycle we
     * are avoiding the first time api hit on rednder.
     */
    if (!firstRenderComplete) setFirstRenderComplete(true);
    else _loadVisitingNodeChildren(vistingNodeChildrenQueryUtils.getQuery());
  }, [vistingNodeChildrenQueryUtils.query]);
  useEffect(() => {
    _checkHasPendingAuthorisation();
    _checkHasPendingSignatures();
  }, []);
  return {
    repository,
    visitingNode,
    visitingNodeChildren,
    detailsOfSelectedChild,
    visitingNodePath,
    processing,
    totalFiles,
    hasPendingAuthorisation,
    hasPendingSignature,
    isBinActive,
    hasOwnership,
    viewTrashBin,
    backToNormalView,
    visitNode,
    visitParentNode,
    loadChildDetails,
    createFolderNode,
    createFileNode,
    amendRepository,
    softDeleteNode,
    moveNode,
    shareDocument,
    hardDeleteNode,
    restoreNode,
    refreshCurretNodeChildrenList,
    getVisitingNodeFolders,
    getVisitingNodeFiles,
    viewAuthorisationRequest,
    viewPendingApproval,
    isViewingAuthorisation,
    isAllowedToUpload,
    renameFolder,
    hasRepositoryOwnership,
  };
}
