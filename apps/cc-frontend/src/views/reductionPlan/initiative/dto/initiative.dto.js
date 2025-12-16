import moment from "moment/moment";
import * as yup from "yup";

export const initiativeFormValidaionSchema = yup.object({
  title: yup.string().required().label("title"),
  hasDateIdentified: yup.boolean().label("hasDateIdentified"),
  identifiedAt: yup.object({
    date: yup.date().max(new Date()).nullable().label("reportingStartDate"),
    label: yup.string().label("reportingStartDate"),
  }),
  description: yup.string().optional().label("description"),
  priority: yup.object({
    label: yup.string().nullable().optional().label("location"),
    value: yup.string().nullable().optional().label("value"),
  }),
  hasDateImplemented: yup.boolean().label("hasDateImplemented"),
  implementedAt: yup.object({
    date: yup.date().max(new Date()).nullable().label("reportingStartDate"),
    label: yup.string().label("reportingStartDate"),
  }),
});
export function getInititveFormState(apiResponse) {
  return {
    title: apiResponse?.title || "",
    hasDateIdentified: apiResponse?.identifiedAt ? true : false,
    identifiedAt: {
      date: apiResponse?.identifiedAt
        ? new Date(apiResponse?.identifiedAt)
        : null,
      label: apiResponse?.identifiedAt
        ? moment(apiResponse?.identifiedAt).format("DD/MM/YYYY")
        : "",
    },
    priority: {
      label: apiResponse?.priority || "",
      value: apiResponse?.priority || "",
    },
    description: apiResponse?.description || "",
    priority: {
      label: apiResponse?.priority || "",
      value: apiResponse?.priority || "",
    },
    hasDateImplemented: apiResponse?.implementedAt ? true : false,
    implementedAt: {
      date: apiResponse?.implementedAt
        ? new Date(apiResponse?.implementedAt)
        : null,
      label: apiResponse?.implementedAt
        ? moment(apiResponse?.implementedAt).format("DD/MM/YYYY")
        : "",
    },
  };
}
