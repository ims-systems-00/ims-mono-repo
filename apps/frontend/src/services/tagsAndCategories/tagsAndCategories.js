import http from "../httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/tags-and-categories`;

export function createTagsAndCategories(data) {
  return http.post(`${apiEndPoint}/`, {
    applicableModules: data.applicableModules.map((tag) => tag.value),
    name: data.name,
    description: data.description,
  });
}
export function listTagsAndCategories({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getTagsAndCategory(id) {
  return http.get(`${apiEndPoint}/${id}/`);
}
export function updateTagsAndCategories(id, data) {
  return http.put(`${apiEndPoint}/${id}`, {
    applicableModules: data.applicableModules.map((tag) => tag.value),
    name: data.name,
    description: data.description,
  });
}
export function deleteTagsAndCategory(id) {
  return http.delete(`${apiEndPoint}/${id}/`);
}

export function mapToTagsAndCategoryModel(tag) {
  return {
    data: {
      applicableModules: tag.applicableModules,
      name: tag.name,
      description: tag.description,
    },
    errors: {},
  };
}
