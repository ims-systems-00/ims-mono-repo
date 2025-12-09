import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/jira-integration`;

export function reportBug(bug) {
  return http.post(`${apiEndPoint}/`, {
    type: bug.category.value,
    summary: bug.title,
    description: bug.description,
  });
}
