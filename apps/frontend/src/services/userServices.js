import { saveCurrentSessionData, savePolicyTokens } from "./authService";
import http from "./httpServices";
import { imsLogger } from "./loggerService";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/users`;
const profileKey = "imsprofile";
export function createUser(user) {
  return http.post(`${apiEndPoint}/`, {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    workPlace: user.workPlace.value,
    salary: user.salary,
    type: user.type.value,
    jobTitle: user.jobTitle,
    accessPeriod: user.accessPeriod.value,
    lineManagers: user.lineManagers.map((lineManager) => lineManager.value),
  });
}

export function updateUserInfo(userId, user) {
  return http.put(`${apiEndPoint}/${userId}/`, {
    firstName: user.firstName,
    lastName: user.lastName,
  });
}

export function addWorkingLocation(userId, data) {
  return http.post(`${apiEndPoint}/${userId}/locations`, {
    address: data.address,
    type: data.isRemote ? "Remote" : "On-site",
  });
}
export function deleteWorkingLocation(userId, locationId) {
  return http.delete(`${apiEndPoint}/${userId}/locations/${locationId}`);
}

export function updateExpiredUsers(users) {
  return http.post(`${apiEndPoint}/expired-users`, {
    users,
  });
}
export function getAllUsers(options) {
  let query = options?.query || "";
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getUserWithBasicInfo(userId) {
  return http.get(`${apiEndPoint}/${userId}/basic-info/`);
}
export function getUserWithClassifiedInfo(userId) {
  return http.get(`${apiEndPoint}/${userId}/classified-info`);
}
export function getActiveUsers() {
  return http.get(`${apiEndPoint}/active/`);
}
export function addUserToGroup(data) {
  return http.post(`${apiEndPoint}/${data.user.value}/groups/`, {
    groupId: data.group.value,
  });
}
export function deleteUserFromGroup(userId, groupId) {
  return http.delete(`${apiEndPoint}/${userId}/groups/${groupId}`);
}
export function changeProfilePic(userId, data) {
  return http.put(`${apiEndPoint}/${userId}/profile-image/`, {
    profileImageInfo: data.profileImageInfo[0],
  });
}
export function changePreferences(userId, data) {
  return http.put(`${apiEndPoint}/${userId}/preferences/`, {
    darkMode: data.darkMode,
    activeTheme: data.activeTheme,
  });
}
/**
 * Deprecated : This function is deprecated. Will be removed later
 */
export function getProfileImage(userId, key) {
  return http.get(`${apiEndPoint}/${userId}/profile-image/`, {
    headers: { "x-file-key": key },
    responseType: "arraybuffer",
  });
}
export function changePassword(userId, data) {
  return http.put(`${apiEndPoint}/${userId}/change-password/`, {
    oldPassword: data.oldPassword,
    password: data.password,
  });
}
export function resetPassword(password) {
  return http.put(`${apiEndPoint}/reset-password/`, {
    password: password,
  });
}
export function transferDataOwnership(userId, data) {
  return http.post(`${apiEndPoint}/${userId}/ownership-transfer`, {
    destinationUser: data.destinationUser.value,
  });
}
export function checkDataOwnership(userId) {
  return http.post(`${apiEndPoint}/${userId}/ownership-checks`);
}
export function deleteUser(userId) {
  return http.delete(`${apiEndPoint}/${userId}/`);
}
export function setCurrentUserInfo() {}
export function getCurrentUserInfo() {
  return JSON.parse(localStorage.getItem("user"));
}
export function changeImsAccess(userId, query) {
  return http.put(`${apiEndPoint}/${userId}/ims-access/?${query}`);
}

export function assignComplianceToolkit(userId, data) {
  return http.put(`${apiEndPoint}/${userId}/compliance-tools`, {
    tools: data.toolkit.map((tool) => tool.value),
  });
}
export async function switchAccessPolicy(userId, id) {
  try {
    const { data: jwt } = await http.put(
      `${apiEndPoint}/${userId}/policy-signature/${id}`
    );
    saveCurrentSessionData(jwt.accessToken);
    savePolicyTokens(jwt.groupPolicyToken, jwt.rolePolicyToken);
    return { data: jwt };
  } catch (err) {
    imsLogger("userServices", err);
  }
}
export function refreshProfileCache(data) {
  localStorage.setItem(profileKey, JSON.stringify(data));
}
export function getUserProfileFromCache() {
  return JSON.parse(localStorage.getItem(profileKey));
}
