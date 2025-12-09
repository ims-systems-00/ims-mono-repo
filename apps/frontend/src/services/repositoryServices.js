import { getCurrentSessionData } from "./authService";
import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/document-repositories`;

// apis related to repository started here
export function getRepositories({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getRepository(repositoryId) {
  return http.get(`${apiEndPoint}/${repositoryId}`);
}
export function createRepository(repository) {
  return http.post(`${apiEndPoint}/`, {
    name: repository.name,
    description: repository.description,
    group: repository.group.value,
    owner:
      repository.privacy.value === "Only me" ||
      repository.privacy.value === "Custom"
        ? getCurrentSessionData().user._id
        : repository.owner.value,
    reviewInterval: repository.reviewInterval.value,
    privacy: repository.privacy.value,
    sharedWith: repository.sharedWith.map((attendee) => attendee.value),
  });
}
export function updateRepository(repositoryId, repository) {
  return http.put(`${apiEndPoint}/${repositoryId}`, {
    name: repository.name,
    description: repository.description,
    group: repository.group.value,
    owner:
      repository.privacy.value === "Only me"
        ? getCurrentSessionData().user._id
        : repository.owner.value,
    reviewInterval: repository.reviewInterval.value,
    privacy: repository.privacy.value,
    sharedWith: repository.sharedWith.map((attendee) => attendee.value),
  });
}

export function restoreRepository(repositoryId) {
  return http.put(`${apiEndPoint}/${repositoryId}/restore`);
}
export function softDeleteRepository(repositoryId) {
  return http.delete(`${apiEndPoint}/${repositoryId}/soft`);
}
export function hardDeleteRepository(repositoryId) {
  return http.delete(`${apiEndPoint}/${repositoryId}/hard`);
}
// apis related to repository end here

// repository node apis started here

export function addFolder(folder, nodeId, repositoryId) {
  return http.post(`${apiEndPoint}/${repositoryId}/folder-nodes`, {
    name: folder.name,
    parentNode: nodeId,
    data: folder.data,
  });
}

export function addFile(file, nodeId, repositoryId) {
  return http.post(`${apiEndPoint}/${repositoryId}/file-nodes`, {
    parentNode: nodeId,
    data: {
      storageInfo: file.attachments[0],
      purpose: file.purpose.value,
      authorisation: file.authorisation
        ? file.authorisation.map((autoriser) => autoriser.value)
        : [],
    },
  });
}

export function listRepoNodeItems(repositoryId, { query }) {
  return http.get(`${apiEndPoint}/${repositoryId}/nodes?${query}`);
}

export function getNode(repositoryId, nodeId) {
  return http.get(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}`);
}

export function getNodePath(repositoryId, nodeId) {
  return http.get(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}/path`);
}

export function getPreservedReviewers(repositoryId, nodeId) {
  return http.get(
    `${apiEndPoint}/${repositoryId}/nodes/${nodeId}/preserved-reviewers`
  );
}

export function addRevision(repositoryId, nodeId, file) {
  return http.put(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}/revision`, {
    file,
  });
}

export function shareDocument(repositoryId, nodeId, document) {
  return http.post(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}/shares`, {
    emails: document.emails,
    message: document.message,
  });
}

export function moveNode(repositoryId, nodeId, movedId) {
  return http.put(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}/move-node`, {
    parentNode: movedId,
  });
}

export function changeRepository(repositoryId, nodeId, movedRepoId) {
  return http.put(
    `${apiEndPoint}/${repositoryId}/nodes/${nodeId}/change-repository`,
    {
      repository: movedRepoId,
      parentNode: null,
    }
  );
}

export function updateFolderNodeMetaData(repositoryId, nodeId, node) {
  return http.put(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}`, {
    name: node.name,
  });
}

export function restoreNode(repositoryId, nodeId) {
  return http.put(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}/restore`);
}

export function softDeleteNode(repositoryId, nodeId) {
  return http.delete(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}/soft`);
}
export function hardDeleteNode(repositoryId, nodeId) {
  return http.delete(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}/hard`);
}

export function mapToNodeModel(node) {
  return {
    data: {
      name: node.name,
    },
    errors: {},
  };
}

// node tree api ends here

// authorisation api started here

export function addAuthoriser(repositoryId, nodeId, data) {
  return http.post(
    `${apiEndPoint}/${repositoryId}/nodes/${nodeId}/authorisation`,
    {
      user: data.user,
    }
  );
}

export function handleAuthorisation(repositoryId, nodeId, authId, data) {
  return http.put(
    `${apiEndPoint}/${repositoryId}/nodes/${nodeId}/authorisation/${authId}`,
    {
      status: data.status,
    }
  );
}

export function hardDeleteDocumentTree(repositoryId, nodeId, authId) {
  return http.delete(
    `${apiEndPoint}/${repositoryId}/nodes/${nodeId}/authorisation/${authId}`
  );
}

// authorisation related apis end here

// signature related api started here

export function addInternalSignature(repositoryId, nodeId, data) {
  return http.post(
    `${apiEndPoint}/${repositoryId}/nodes/${nodeId}/internal-signatures`,
    {
      users: data.users,
      signatureLocations: data.signatureLocations,
      message: data.message,
    }
  );
}

export function addExternalSignature(repositoryId, nodeId, data) {
  return http.post(
    `${apiEndPoint}/${repositoryId}/nodes/${nodeId}/external-signatures`,
    {
      emails: data.emails,
      signatureLocations: data.signatureLocations,
      message: data.message,
    }
  );
}

export function getSignaturesOnNode(repositoryId, nodeId) {
  return http.get(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}/signatures`);
}

export function removeSignatures(repositoryId, nodeId, data) {
  return http.put(`${apiEndPoint}/${repositoryId}/nodes/${nodeId}/signatures`, {
    signatures: data.signatures,
  });
}

export function handleSignature(repositoryId, nodeId, signatureId, data) {
  return http.put(
    `${apiEndPoint}/${repositoryId}/nodes/${nodeId}/signatures/${signatureId}`,
    {
      status: data.status,
      name: data.name,
      signature: data.signature,
      organisation: data.organisation,
      jobTitle: data.jobTitle,
      font: data.font,
    }
  );
}

// signature related api ended here

export function getReviews(repositoryId, { query }) {
  return http.get(`${apiEndPoint}/${repositoryId}/reviews/?${query}`);
}

export function addReviewers({ repositoryId, documentId, type, users }) {
  return http.post(`${apiEndPoint}/${repositoryId}/reviews`, {
    type: type,
    repository: repositoryId,
    document: documentId,
    users,
  });
}

export function removeReviewer({ repositoryId, documentId, type, userId }) {
  return http.put(`${apiEndPoint}/${repositoryId}/reviews`, {
    type: type,
    repository: repositoryId,
    document: documentId,
    users: [userId],
  });
}

export function addDocumentToRepository(repositoryId, repository) {
  return http.post(`${apiEndPoint}/${repositoryId}/documents`, {
    storageInfo: repository.storageInfo[0],
    status: repository.authorisers.length > 0 ? "Pending" : "Published",
  });
}

export function getDocumentFromRepository(docId, documentId) {
  return http.get(`${apiEndPoint}/${docId}/documents/${documentId}`);
}

export function handleReview(repositoryId, reviewId, status) {
  return http.put(`${apiEndPoint}/${repositoryId}/reviews/${reviewId}`, {
    status: status,
  });
}
export function shareWith(repositoryId, repository) {
  return http.post(`${apiEndPoint}/${repositoryId}/shares/`, {
    users: repository.sharedWith.length
      ? repository.sharedWith.map((user) => user.value)
      : [],
  });
}

export function deleteDocumentFromRepository(repositoryId, documentId) {
  return http.delete(`${apiEndPoint}/${repositoryId}/documents/${documentId}`);
}

export function mapToRepositoryModel(repository) {
  return {
    data: {
      name: repository.name,
      description: repository.description,
      group: !repository.group
        ? {
            value: null,
            label: "Business unit",
          }
        : {
            value: repository.group._id,
            label: repository.group.name,
          },
      owner: repository.owner
        ? {
            value: repository.owner._id,
            label: repository.owner.name,
          }
        : {
            value: null,
            label: "Select owner",
          },
      reviewInterval: {
        value: repository.reviewInterval,
        label: repository.reviewInterval,
      },
      privacy: {
        value: repository.privacy,
        label: repository.privacy,
      },
      sharedWith: repository.sharedWith
        ?.filter((attendee) => attendee)
        .map((attendee) => ({ value: attendee._id, label: attendee.name })),
    },
    errors: {},
  };
}
export function mapToShareWithModel(data) {
  return {
    data: {
      sharedWith: data.sharedWith.length
        ? data.sharedWith.map((user) => ({ value: user._id, label: user.name }))
        : [],
    },
    errors: {},
  };
}

export function mapToSigneeAndAuthorisers(signee, authorisers) {
  return {
    data: {
      signature: signee.length > 0 ? true : false,
      authorisation: authorisers.length > 0 ? true : false,
      signees: signee.map((signee) => ({
        value: signee.user?._id,
        label: signee.user?.name,
      })),
      authorisers: authorisers.map((authoriser) => ({
        value: authoriser.user?._id,
        label: authoriser.user?.name,
      })),
    },
    errors: {},
  };
}
