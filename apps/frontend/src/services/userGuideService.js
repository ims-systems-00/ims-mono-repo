import http from "./httpServices";
const apiEndPoint = `userguide`;
export function getUserGuide() {
  return http.get(`${apiEndPoint}`);
}
