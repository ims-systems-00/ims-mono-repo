import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/iam-groups`;
const groupsKey = "groups";
const complianceBodyKey = "complianceBody";
const cqcGroupsKey = "cqcGroups";

export function getGroups({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getGroup(groupId) {
  return http.get(`${apiEndPoint}/${groupId}`);
}
export function createGroup(data) {
  return http.post(`${apiEndPoint}/`, {
    type: data.type.value,
    name: data.name,
    operatingLocation: data.operatingLocation,
    standards: data.standards,
    responsibility: data.responsibility,
  });
}
export function updateGroupDescription(groupId, group) {
  return http.put(`${apiEndPoint}/${groupId}`, {
    name: group.name,
    operatingLocation: group.operatingLocation,
    standards: group.standards,
    responsibility: group.responsibility,
  });
}
export function mapToIamGroupModel(data) {
  return {
    data: {
      type: {
        value: data.type,
        label: data.type,
      },

      name: data.name,
      operatingLocation: data.details.operatingLocation,
      standards: data.details.standards,
      responsibility: data.responsibility,
    },
    errors: {},
  };
}
export function deleteGroup(groupId) {
  return http.delete(`${apiEndPoint}/${groupId}`);
}
export function refreshGroupsCache(groups, complianceBody, cqcBody) {
  localStorage.setItem(groupsKey, groups);
  localStorage.setItem(complianceBodyKey, complianceBody);
  localStorage.setItem(cqcGroupsKey, cqcBody);
}
export function getGroupsCache() {
  return localStorage.getItem(groupsKey);
}
export function getComplianceBodyCache() {
  return localStorage.getItem(complianceBodyKey);
}
export function getCqcBodyCache() {
  return localStorage.getItem(cqcGroupsKey);
}
export function removeGroupsCache() {
  localStorage.removeItem(groupsKey);
  localStorage.removeItem(cqcGroupsKey);
  localStorage.removeItem(complianceBodyKey);
}
export function attachPolicy(groupId, data) {
  return http.post(`${apiEndPoint}/${groupId}/policies/`, {
    policyId: data.policy.value,
  });
}
export function assignComplianceToolkit(groupId, data) {
  return http.put(`${apiEndPoint}/${groupId}/compliance-tools`, {
    tools: data.toolkit.map((tool) => tool.value),
  });
}

export function mapToLicenseManagement(group) {
  return {
    data: {
      hosAmount: group.hosAmount,
      basicAmount: group.basicAmount,
      auditorAmount: group.auditorAmount,
      action: group.action.value,
    },
    errors: {},
  };
}
