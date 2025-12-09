import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/memberships`;
const membershipkey = "membership";
export function listMemberships(options) {
  return http.get(`${apiEndPoint}/?${options?.query || ""}`);
}
export function getMembership(id) {
  return http.get(`${apiEndPoint}/${id}/`);
}
export function updateMembership(id, data) {
  return http.put(`${apiEndPoint}/${id}`, {
    workLocationType: data.workPlace.value,
    jobTitle: data.jobTitle,
    salary: data.salary,
    lineManagers: data.lineManagers.map((lineManager) => lineManager.value),
    leaveDaysEntitledTo: data.leaveDaysEntitledTo,
    country: {
      name: data.country.label,
      code: data.country.value,
    },
    workShift: {
      weeklyHours: [
        data.sunday
          ? {
              startTime: getTimeInMilliseconds(data.sundayStart),
              endTime: getTimeInMilliseconds(data.sundayEnd),
            }
          : { startTime: -1, endTime: -1 },
        data.monday
          ? {
              startTime: getTimeInMilliseconds(data.mondayStart),
              endTime: getTimeInMilliseconds(data.mondayEnd),
            }
          : { startTime: -1, endTime: -1 },
        data.tuesday
          ? {
              startTime: getTimeInMilliseconds(data.tuesdayStart),
              endTime: getTimeInMilliseconds(data.tuesdayEnd),
            }
          : { startTime: -1, endTime: -1 },
        data.wednesday
          ? {
              startTime: getTimeInMilliseconds(data.wednesdayStart),
              endTime: getTimeInMilliseconds(data.wednesdayEnd),
            }
          : { startTime: -1, endTime: -1 },
        data.thursday
          ? {
              startTime: getTimeInMilliseconds(data.thursdayStart),
              endTime: getTimeInMilliseconds(data.thursdayEnd),
            }
          : { startTime: -1, endTime: -1 },
        data.friday
          ? {
              startTime: getTimeInMilliseconds(data.fridayStart),
              endTime: getTimeInMilliseconds(data.fridayEnd),
            }
          : { startTime: -1, endTime: -1 },
        data.saturday
          ? {
              startTime: getTimeInMilliseconds(data.saturdayStart),
              endTime: getTimeInMilliseconds(data.saturdayEnd),
            }
          : { startTime: -1, endTime: -1 },
      ],
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
}
export function changeMembershipRole(id, role) {
  return http.put(`${apiEndPoint}/${id}/role`, {
    role: role,
  });
}
export function deleteMembership(id) {
  return http.delete(`${apiEndPoint}/${id}/hard`);
}
export function refreshMembershipCache(data) {
  localStorage.setItem(membershipkey, JSON.stringify(data));
}
export function getMembershipFromCache() {
  return JSON.parse(localStorage.getItem(membershipkey));
}

function getTimeInMilliseconds(time) {
  let splittedTime = time.split(":");
  let hr = parseInt(splittedTime[0]);
  let mnt = parseInt(splittedTime[1]);
  let d = new Date(),
    e = new Date();
  let msSinceMidnight = e.setHours(hr, mnt, 0) - d.setHours(0, 0, 0);
  return msSinceMidnight;
}
