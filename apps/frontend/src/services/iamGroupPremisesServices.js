import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/iam-group-premises`;

export function getGroupPremises({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}

export function getGroupPremise(premiseId) {
  return http.get(`${apiEndPoint}/${premiseId}`);
}

export function createGroupPremise(premise) {
  return http.post(`${apiEndPoint}/`, {
    groups: premise.groups.map((group) => group.value),
    name: premise.name,
    location: premise.location,
    address: premise.address,
    createdBy: getCurrentSessionData().user._id,
  });
}

export function updatePremise(premiseId, premise) {
  return http.put(`${apiEndPoint}/${premiseId}`, {
    groups: premise.groups.map((group) => group.value),
    name: premise.name,
    location: premise.location,
    address: premise.address,
  });
}

export function deletePremise(premiseId) {
  return http.delete(`${apiEndPoint}/${premiseId}`);
}

export function attachGroupPolicy(premiseId, group) {
  return http.post(`${apiEndPoint}/${premiseId}/policies`, {
    group,
  });
}

export function mapToPremiseModel(premise) {
  return {
    data: {
      groups: premise.groups.map((group) => ({
        value: group._id,
        label: group.name,
      })),
      name: premise.name,
      address: premise.address,
      location: premise.location,
    },
    errors: {},
  };
}
