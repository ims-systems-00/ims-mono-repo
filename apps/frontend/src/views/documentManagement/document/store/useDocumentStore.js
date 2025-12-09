import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import useUsers from "@/hooks/useUsers";
import { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getCurrentSessionData } from "@/services/authService";
import * as documentManagmentApi from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
import { startListening, stopListening } from "@/services/webSocketService";
import USER_ACTIONS from "./actions";
import { useApplication } from "@/stores/applicationStore";
import { getLicenses } from "@/services/organizationService";

export default function useRepositoryStore(config) {
  const [document, setDocument] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [versions, setVersions] = useState([]);
  const [repository, setRepository] = useState(null);
  let [toolKits, setToolKits] = useState([]);
  const history = useHistory();
  const { users: _users, lazyLoadUsers } = useUsers();
  const verstionsQueryUtils = useQuery({});
  const notify = useContext(NotificationContext);
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  // handler functions & api hits based on requirement...
  async function _loadNode() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_NODE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.getNode(
        config.repoId,
        config.docId
      );
      setDocument(data.node);
      verstionsQueryUtils.handleRequired({
        value: {
          /**
           * name is required to trace the document uniquely in the current level
           * of tree within the repository
           */
          name: data.node?.name,
          /**
           * type is a must otherwise will start to populate folders if system
           * finds a same folder with this document name, which is undesired.
           */
          type: "document",
          /**
           * without parent node we can not detect the proper version of a
           * document in the folder tree, because same file "name" might be managed
           * differently in different levels in the folder tree.
           */
          parentNode:
            data.node?.parentNode?._id || data.node?.parentNode || null,
          /**
           * only list versions that are still alive
           */
          deleteMarker: { status: data.node?.deleteMarker?.status },
          sort: "-documentData.dvID",
        },
      });
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
  }
  async function _loadSignatures() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_SIGNATURES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.getSignaturesOnNode(
        config.repoId,
        config.docId
      );
      setSignatures(data.usersForSignature);
      _dispatch({
        [USER_ACTIONS.LOAD_SIGNATURES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.LOAD_SIGNATURES]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function _loadVersions(query = "") {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_VERSIONS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.listRepoNodeItems(
        config.repoId,
        {
          query,
        }
      );
      setVersions(data.nodes);
      if (data.pagination?.currentPage === 1) setVersions(data.nodes || []);
      else setVersions((prevChildren) => [...prevChildren, ...data.nodes]);
      if (data.pagination?.hasNextPage) {
        verstionsQueryUtils.handlePagination({
          page: data.pagination.nextPage,
          size: 30,
        });
      }
      _dispatch({
        [USER_ACTIONS.LOAD_VERSIONS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.LOAD_VERSIONS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  function _removeFromSignatureState(list = []) {
    setSignatures((signatures) =>
      signatures.filter((s) => !list.includes(s?._id))
    );
  }
  function _extractFileExtension() {
    if (document) {
      const splited = document?.name?.split(".");
      return splited[splited.length - 1];
    }
    return "";
  }
  async function handleVersionAuthorisation(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.HANDLE_APPROVAL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.handleAuthorisation(
        config.repoId,
        config.docId,
        payload
      );
      // await activityApi.createActivity({
      //   moduleId: config.docId,
      //   moduleType: "documenttrees",
      //   value: payload.message,
      // });
      setDocument(data.node);
      _dispatch({
        [USER_ACTIONS.HANDLE_APPROVAL]: {
          status: false,
          error: false,
          id: null,
        },
      });
      if (data.node.status === "Published") {
        notify(
          `This document has now been approved and will be published in  ${repository.reference} ${repository.name}`,
          "success",
          {
            onRemoval: () => {
              window.location.reload();
            },
          }
        );
      } else if (data.node.status === "Pending") {
        notify(
          `You have approved this document and will be published once other authorisers approve this document.`,
          "success"
        );
      } else
        notify(
          `This document has now been rejected, your feedback will be provided to ${data?.node?.created?.by?.name}`,
          "success"
        );
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.HANDLE_APPROVAL]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function signDocument(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.SIGN_DOCUMENT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.handleSignature(
        config.repoId,
        config.docId,
        payload
      );
      setSignatures((prevSignatures) =>
        prevSignatures.map((signature) =>
          signature?._id === data?.userSignature?._id
            ? data.userSignature
            : signature
        )
      );
      if (data?.userSignature?.type === "Internal")
        notify(
          "Document has been signed. You can now view and download a copy.",
          "success",
          {
            onRemoval: () => {
              window.location.reload();
            },
          }
        );
      if (data?.userSignature?.type === "External")
        notify(
          `Document has been signed and sent to your 
          email ${data?.userSignature?.user?.externalEmail}. 
          Your limited access has also been automatically invalidated by the system. 
          Please close this tab on your browser.`,
          "success",
          {
            duration: 10000,
            onRemoval: () => {
              window.close();
            },
          }
        );
      _dispatch({
        [USER_ACTIONS.SIGN_DOCUMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.SIGN_DOCUMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function addInternalSignee(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_INTERNAL_SIGNEE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.addInternalSignature(
        config.repoId,
        config.docId,
        payload
      );
      notify(
        `This document will be sent to ${payload.users?.length} ${
          payload.users?.length > 1 ? "users" : "user"
        } in your organisation for signature`,
        "success"
      );
      window.location.reload();
      _dispatch({
        [USER_ACTIONS.ADD_INTERNAL_SIGNEE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.ADD_INTERNAL_SIGNEE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function addExternalSignee(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_EXTERNAL_SIGNEE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.addExternalSignature(
        config.repoId,
        config.docId,
        payload
      );
      notify(
        `This document will be sent to ${payload.emails?.length} external ${
          payload.emails?.length > 1 ? "individuals" : "individual"
        } for signature`,
        "success"
      );
      window.location.reload();
      _dispatch({
        [USER_ACTIONS.ADD_EXTERNAL_SIGNEE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.ADD_EXTERNAL_SIGNEE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function removeSignatures(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.REMOVE_SIGNEE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.removeSignatures(
        config.repoId,
        config.docId,
        payload
      );
      _removeFromSignatureState(payload.signatures);
      _dispatch({
        [USER_ACTIONS.REMOVE_SIGNEE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.REMOVE_SIGNEE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function shareDocument(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.SHARE_DOCUMENT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.shareDocument(
        config.repoId,
        config.docId,
        payload
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
        "danger"
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
  async function addRevision(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_REVISION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.addRevision(
        config.repoId,
        config.docId,
        payload
      );
      notify(`Successfully added a revision.`, "success");
      _dispatch({
        [USER_ACTIONS.ADD_REVISION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      notify(
        err.message || "Server error occured, please try again later.",
        "danger"
      );
      _dispatch({
        [USER_ACTIONS.ADD_REVISION]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  function loadSignatures() {
    _loadSignatures();
  }
  function reloadVersions() {
    verstionsQueryUtils.handlePagination({ page: 1, size: 30 });
  }
  function getAvailableUsersForRequest() {
    const alreadyIn = signatures
      .filter((s) => s?.type === "Internal")
      .map((s) => s?.user?.internalRef?._id);
    return _users.filter((user) => !alreadyIn.includes(user?._id));
  }
  /**
   * Following block is reponsible for tracking the signature queue response from backend
   */
  let globalData = useApplication();
  let _updateSignaureDataOnSignatureInformation = useCallback(function (data) {
    notify("Signature request has been sent successfully", "success");
    _loadNode();
    loadSignatures();
  }, []);
  useEffect(() => {
    let events = { new_document_signature_info: "new-document-signature-info" };
    if (getCurrentSessionData() && globalData?.socketSubscriptionDetails)
      startListening(
        events.new_document_signature_info,
        _updateSignaureDataOnSignatureInformation
      );
    return () => {
      stopListening(
        events.new_document_signature_info,
        _updateSignaureDataOnSignatureInformation
      );
    };
  }, [globalData?.socketSubscriptionDetails]);
  useEffect(() => {
    _loadNode();
  }, []);
  useEffect(() => {
    async function _loadRepository() {
      try {
        const { data } = await documentManagmentApi.getRepository(
          config.repoId
        );
        setRepository(data.repository);
      } catch (err) {
        imsLogger(err);
      }
    }
    _loadRepository();
  }, []);
  useEffect(() => {
    /**
     * following if check is a must because the action version query
     * changes only after document is loaded see: _loadNode() implementation.
     * otherwise api will load unnecessary documents and versions.
     */
    if (document?._id) _loadVersions(verstionsQueryUtils.getQuery());
  }, [verstionsQueryUtils.query]);
  useEffect(() => {
    _loadSignatures();
  }, []);
  useEffect(() => {
    lazyLoadUsers();
  }, []);
  function getAuthorisationDataForAuthoriser(id) {
    return document?.documentData?.authorisation.find(
      (auth) => auth?.user?._id === id
    );
  }
  function getSignatureDataForInternalUser(id) {
    if (!id) return null;
    return signatures.find((s) => s?.user?.internalRef?._id === id);
  }
  function getSignatureDataForExternalUser(email) {
    if (!email) return null;
    return signatures.find((s) => s?.user?.externalEmail === email);
  }
  function hasPendingAuthorisationByTheUser(id) {
    return document?.documentData?.authorisation.find(
      (auth) => auth?.user?._id === id && auth.status === "Pending"
    );
  }
  function hasPendingSignatureByTheInternalUser(id) {
    if (!id) return null;
    return signatures.find(
      (s) => s?.user?.internalRef?._id === id && s.status === "Pending"
    );
  }
  function hasSignatureByTheInternalUser(id) {
    if (!id) return null;
    return signatures.find(
      (s) => s?.user?.internalRef?._id === id && s.status === "Signed"
    );
  }
  function hasPendingSignatureByTheExternalUser(email) {
    return signatures.find(
      (s) => s?.user?.externalEmail === email && s.status === "Pending"
    );
  }
  function hasOwnership(id) {
    if (!id) return null;
    return document?.documentData?.owners?.map((o) => o._id).includes(id);
  }
  function isUnderAuthorisation() {
    return (
      document?.status === "Pending" ||
      versions.map((v) => v.status).includes("Pending")
    );
  }
  function isPublished() {
    return document?.status === "Published";
  }
  function isSignatureAllowedForFileType() {
    return ["pdf", "doc", "docx"].includes(_extractFileExtension());
  }
  async function uploadNewVersion(payload) {
    if (payload?.attachments[0]?.Name !== document?.name) {
      notify("Please select file with same name.", "danger");
      return;
    }
    if (document) {
      try {
        _dispatch({
          [USER_ACTIONS.ADD_NEW_VERSION]: {
            status: true,
            error: false,
            id: null,
          },
        });
        let { data } = await documentManagmentApi.addFileVersion(
          {
            ...payload,
            nodeId: document?._id,
            parentNode: document?.parentNode,
          },
          config.repoId
        );
        let node = data.node;
        // history.push(
        //   `/admin/document-repositories/${config.repoId}/nodes/${node?._id}`
        // );
        window.location = `/admin/document-repositories/${config.repoId}/nodes/${node?._id}`;
        notify("New version uploaded successfully", "success");
        _dispatch({
          [USER_ACTIONS.ADD_NEW_VERSION]: {
            status: false,
            error: false,
            id: null,
          },
        });
      } catch (err) {
        imsLogger(err, err.message);
        notify(
          err.response?.data?.message ||
            err.message ||
            "Server error occured, please try again later.",
          "danger"
        );
        _dispatch({
          [USER_ACTIONS.ADD_NEW_VERSION]: {
            status: false,
            error: true,
            id: null,
          },
        });
      }
    }
  }
  async function updateDocumentMetaData(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_NODE_INFO]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.updateDocumentNodeMetaData(
        config.repoId,
        config.docId,
        {
          ...payload,
        }
      );
      setDocument(data.node);
      notify("Document information updated", "success");
      _dispatch({
        [USER_ACTIONS.UPDATE_NODE_INFO]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      notify(
        err.response?.data?.message ||
          err.message ||
          "Server error occured, please try again later.",
        "danger"
      );
      _dispatch({
        [USER_ACTIONS.UPDATE_NODE_INFO]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getLicenses(
          globalData?.tokenPair?.accessTokenData?.user?.organizationId
        );
        setToolKits(
          data.licenses.complianceTools.map((tool) => ({ name: tool }))
        );
      } catch (ex) {
        imsLogger("ManageLicense", ex.response);
      }
    }
    fetchData();
  }, []);
  async function resendInternalSignature(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.RESEND_INTERNAL_SIGNEE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.resendInternalSignatureRequest(
        payload.signatures
      );
      notify(`Signature request sent successfully`, "success");
      _dispatch({
        [USER_ACTIONS.RESEND_INTERNAL_SIGNEE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.RESEND_INTERNAL_SIGNEE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  async function resendExternalSignature(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.RESEND_EXTERNAL_SIGNEE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.resendExternalSignatureRequest(
        payload.signatures
      );
      notify(`Signature request sent successfully`, "success");
      _dispatch({
        [USER_ACTIONS.RESEND_EXTERNAL_SIGNEE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.RESEND_EXTERNAL_SIGNEE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  return {
    document,
    repository,
    versions,
    signatures,
    processing,
    toolKits,
    updateDocumentMetaData,
    getAvailableUsersForRequest,
    loadSignatures,
    reloadVersions,
    shareDocument,
    addExternalSignee,
    addInternalSignee,
    removeSignatures,
    signDocument,
    getSignatureDataForInternalUser,
    getSignatureDataForExternalUser,
    handleVersionAuthorisation,
    getAuthorisationDataForAuthoriser,
    hasPendingAuthorisationByTheUser,
    hasOwnership,
    isUnderAuthorisation,
    isPublished,
    hasPendingSignatureByTheExternalUser,
    hasPendingSignatureByTheInternalUser,
    hasSignatureByTheInternalUser,
    isSignatureAllowedForFileType,
    addRevision,
    uploadNewVersion,
    resendInternalSignature,
    resendExternalSignature,
  };
}
