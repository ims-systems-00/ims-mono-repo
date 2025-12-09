import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/iam-policies`;

export function getPolicies({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getPolicy(policyId) {
  return http.get(`${apiEndPoint}/${policyId}`);
}
export function createPolicy(policy) {
  return http.post(`${apiEndPoint}/`, {
    name: policy.name,
    usedFor: policy.usedFor.value,
    type: policy.type.value,
    accessScope: policy.accessScope.value,
    statement: policy.statement,
  });
}
export function updatePolicy(policyId, policy) {
  return http.put(`${apiEndPoint}/${policyId}`, {
    name: policy.name,
    type: policy.type.value,
    accessScope: policy.accessScope.value,
    statement: policy.statement,
  });
}
export function mapToPolicyModel(data) {
  return {
    data: {
      name: data.name,
      usedFor: {
        value: data.usedFor,
        label: data.usedFor,
      },
      type: {
        value: data.type,
        label: data.type,
      },
      accessScope: {
        value: data.accessScope,
        label: data.accessScope,
      },
      statement: data.statement,
    },
    errors: {},
  };
}
export function mapToStatementModel(statement) {
  return {
    data: {
      service: {
        value: statement.service,
        label: statement.service,
      },
      resources: statement.resources.map((item) => ({
        value: item,
        lable: item,
      })),
      actions: statement.resources.map((item) => ({
        value: item,
        lable: item,
      })),
      effect: "allow",
    },
    errors: {},
  };
}
export function deletePolicy(policyId) {
  return http.delete(`${apiEndPoint}/${policyId}/`);
}
