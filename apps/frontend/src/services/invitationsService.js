import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/invitations`;

export function createInvitation(data) {
  return http.post(`${apiEndPoint}/`, {
    role: data.role,
    email: data.email,
  });
}
export function listInvitations(options) {
  return http.get(`${apiEndPoint}/?${options?.query || ""}`);
}
export function acceptInvitation(token) {
  return http.post(
    `${apiEndPoint}/acceptance`,
    {},
    {
      headers: { "x-invitation-token": token },
    }
  );
}
export function resendInvitation(id) {
  return http.put(`${apiEndPoint}/` + id);
}
export function deleteInvitation(id) {
  return http.delete(`${apiEndPoint}/` + id);
}
