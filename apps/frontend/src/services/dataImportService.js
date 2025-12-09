import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/data-import`;

export function getSchema(module) {
  return http.get(`${apiEndPoint}/schema/${module}`);
}
export function startImport(config, requestConfig) {
  return http.post(
    `${apiEndPoint}/`,
    {
      module: config.module,
      format: config.format,
      dateFormat: config.dateFormat,
      dataMap: config?.dataMap || {},
      dataSet: config?.dataSet || [],
    },
    requestConfig
  );
}
export function validate(config, requestConfig) {
  return http.post(
    `${apiEndPoint}/validation`,
    {
      module: config.module,
      format: config.format,
      dateFormat: config.dateFormat,
      dataMap: config?.dataMap || {},
      dataSet: config?.dataSet || [],
    },
    requestConfig
  );
}
