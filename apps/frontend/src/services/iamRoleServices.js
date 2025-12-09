import http from "./httpServices";
import moment from "moment";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/iam-roles`;

export function getRoles() {
  return http.get(`${apiEndPoint}/`);
}

export function getRole(roleId) {
  return http.get(`${apiEndPoint}/${roleId}`);
}

export function createRole(role) {
  return http.post(`${apiEndPoint}/`, {
    name: role.name,
    type: role.type.value,
    policy: role.policy.value,
  });
}

export function updateRole(roleId, role) {
  return http.put(`${apiEndPoint}/${roleId}`, {
    name: role.name,
    type: role.type.value,
    policy: role.policy.value,
  });
}

export function deleteRole(roleId) {
  return http.delete(`${apiEndPoint}/${roleId}`);
}

export function mapToIamRoleModel(role) {
  return {
    data: {
      policy: role.policy
        ? {
            value: role.policy._id,
            label: role.policy.name,
          }
        : {
            value: null,
            label: "Select policy",
          },
      name: role.name,
      type: {
        value: role.type,
        label: role.type,
      },
      errors: {},
    },
  };
}
