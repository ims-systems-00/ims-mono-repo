import jwtDecode from "jwt-decode";
import http from "./httpServices";
import { removeGroupsCache } from "./iamGroupServices";
import { removeOrganisationCache } from "./organizationService";
import { getCurrentUserInfo } from "./userServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/auth`;
let currentSessionDataKey = "currentSession";
let groupPolicyTokenKey = "groupPolicyToken";
let rolePolicyTokenKey = "rolePolicyToken";
let tenantKey = "tenant";
let guideKey = "guide-jwt";
export async function registerAccount(user) {
  await http.post(apiEndPoint + "/registration", {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
  });
  /** we are auto loging user in with same password for better UX */
  return login(user);
}
export function resendVerificationEmail(id) {
  return http.post(`${apiEndPoint}/verification/${id}`);
}
export async function verifyAccount({ token }) {
  return http.post(
    `${apiEndPoint}/verification`,
    {},
    { headers: { "x-verification-token": token } }
  );
}
export async function login(user) {
  const { data: jwt } = await http.post(apiEndPoint, {
    email: user.email,
    password: user.password,
  });
  saveCurrentSessionData(jwt.accessToken);
  saveGuideToken(jwt.omniplexToken);
  return jwt;
}
export async function refreshToken() {
  return http.post(apiEndPoint + "/refresh-token");
}
export async function forgotPassword(user) {
  return http.post(`${apiEndPoint}/forgotpassword`, {
    email: user.email,
  });
}
export async function setupPassword(user) {
  return http.post(
    `${apiEndPoint}/resetpassword`,
    {
      password: user.password,
    },
    {
      headers: { "x-resetpassword-token": user.token, "x-tenant": user.tenant },
    }
  );
}
export function saveCurrentSessionData(accessToken) {
  let accessTokenData = jwtDecode(accessToken);
  localStorage.setItem(currentSessionDataKey, JSON.stringify(accessTokenData));
}
export function savePolicyTokens(groupPolicyToken, rolePolicyToken) {
  localStorage.setItem(groupPolicyTokenKey, groupPolicyToken);
  localStorage.setItem(rolePolicyTokenKey, rolePolicyToken);
}
export function saveGuideToken(token) {
  localStorage.setItem(guideKey, token);
}
export async function changePassword(user) {
  return http.post(`${apiEndPoint}/changepassword`, {
    oldPassword: user.oldPassword,
    password: user.password,
    user: getCurrentUserInfo(),
  });
}
export async function logout() {
  localStorage.clear();
  removeGroupsCache();
  removeOrganisationCache();
  await http.delete(apiEndPoint);
}
export function getCurrentSessionData() {
  return JSON.parse(localStorage.getItem(currentSessionDataKey));
}
export function getTenant() {
  return localStorage.getItem(tenantKey);
}
export function getOmniplexToken() {
  return localStorage.getItem(guideKey);
}
export function getGroupPolicyTokenData() {
  try {
    let groupPolicyTokenData = localStorage.getItem(groupPolicyTokenKey);
    let data = jwtDecode(groupPolicyTokenData);
    return data;
  } catch (ex) {
    return null;
  }
}
export function getRolePolicyTokenData() {
  try {
    let rolePolicyTokenData = localStorage.getItem(rolePolicyTokenKey);
    let data = jwtDecode(rolePolicyTokenData);
    return data;
  } catch (ex) {
    return null;
  }
}
export function getGroupPolicyToken() {
  return localStorage.getItem(groupPolicyTokenKey);
}
export function getRolePolicyToken() {
  return localStorage.getItem(rolePolicyTokenKey);
}
