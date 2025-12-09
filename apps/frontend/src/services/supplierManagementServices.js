import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/suppliers`;

export function getSuppliers({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getSupplier(supplierId) {
  return http.get(`${apiEndPoint}/${supplierId}`);
}
export function createSupplier(supplier) {
  return http.post(`${apiEndPoint}/`, {
    group: supplier.group.value,
    name: supplier.name,
    accountManager: supplier.accountManager,
    accountNumber: supplier.accountNumber,
    buyer: supplier.buyer.value,
    email: supplier.email,
    serviceProvision: supplier.serviceProvision,
    contractValue: supplier.contractValue,
    slaFiles: supplier.slaFiles,
    contractFiles: supplier.contractFiles,
    onBoardingFiles: supplier.onBoardingFiles,
    contractStartDate: new Date(
      moment(supplier.contractStartDate, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    contractEndDate: new Date(
      moment(supplier.contractEndDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    reviewDate: new Date(
      moment(supplier.reviewDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    createdBy: getCurrentSessionData().user._id,
  });
}
export function updateSupplier(supplierId, supplier) {
  return http.put(`${apiEndPoint}/${supplierId}`, {
    name: supplier.name,
    accountManager: supplier.accountManager,
    accountNumber: supplier.accountNumber,
    buyer: supplier.buyer.value,
    email: supplier.email,
    serviceProvision: supplier.serviceProvision,
    contractValue: supplier.contractValue,
    slaFiles: supplier.slaFiles,
    contractFiles: supplier.contractFiles,
    onBoardingFiles: supplier.onBoardingFiles,
    contractStartDate: new Date(
      moment(supplier.contractStartDate, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    contractEndDate: new Date(
      moment(supplier.contractEndDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    reviewDate: new Date(
      moment(supplier.reviewDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
  });
}
export function deleteSupplier(supplierId) {
  return http.delete(`${apiEndPoint}/${supplierId}`);
}
export function mapToSupplierModel(supplier) {
  return {
    data: {
      group: {
        value: supplier.group?._id,
        label: supplier.group?.name,
      },
      name: supplier.name,
      accountManager: supplier.accountManager,
      accountNumber: supplier.accountNumber,
      buyer: {
        value: supplier.buyer?._id,
        label: supplier.buyer?.name,
      },
      email: supplier.email,
      serviceProvision: supplier.serviceProvision,
      contractValue: supplier.contractValue,
      slaFiles: [],
      contractFiles: [],
      onBoardingFiles: [],
      contractStartDate: moment(supplier.contractStartDate).format("D/M/Y"),
      contractEndDate: moment(supplier.contractEndDate).format("D/M/Y"),
      reviewDate: moment(supplier.reviewDate).format("D/M/Y"),
    },
    errors: {},
  };
}
export function addKpiObjective(supplierId, data) {
  return http.post(`${apiEndPoint}/${supplierId}/kpi-objectives`, {
    kpiObjective: {
      value: data.value,
    },
  });
}
export function deleteKpiObjective(supplierId, kpiObjectiveId) {
  return http.delete(
    `${apiEndPoint}/${supplierId}/kpi-objectives/${kpiObjectiveId}`
  );
}
export function mapToSupplierKpiObjectiveModel(data) {
  return {
    data: {
      value: data.value,
    },
    errors: {},
  };
}

export function getSupplierIncidents(supplierId) {
  return http.get(`${apiEndPoint}/${supplierId}/incidents`);
}
export function getSupplierIncident(supplierId, incidentId) {
  return http.get(`${apiEndPoint}/${supplierId}/incidents/${incidentId}`);
}
export function createSupplierIncident(supplierId, incident) {
  return http.post(`${apiEndPoint}/${supplierId}/incidents`, {
    title: incident.title,
    description: incident.description,
    methodOfNotification: incident.methodOfNotification,
    createdBy: getCurrentSessionData().user._id,
    priority: incident.priority.value,
    // affectedService: incident.affectedService,
  });
}
export function updateSupplierIncident(supplierId, incidentId, incident) {
  return http.put(`${apiEndPoint}/${supplierId}/incidents/${incidentId}`, {
    title: incident.title,
    description: incident.description,
    methodOfNotification: incident.methodOfNotification,
    priority: incident.priority.value,
    resolution: incident.resolution,
    updatedBy: getCurrentSessionData().user._id,
    resolution: incident.resolution,
    resolveStatus: incident.resolveStatus,
  });
}

export function deleteSupplierIncident(supplierId, incidentId) {
  return http.delete(`${apiEndPoint}/${supplierId}/incidents/${incidentId}`);
}

export function mapToSupplierIncidentModel(incident) {
  return {
    data: {
      title: incident.title,
      description: incident.description,
      methodOfNotification: incident.methodOfNotification,
      priority: {
        value: incident.priority,
        label: incident.priority,
      },
      resolveStatus: incident.resolved.status,
      resolution: incident.resolution,
      // affectedService: incident.affectedService,
    },
    errors: {},
  };
}
export function addSla(supplierId, data) {
  return http.post(`${apiEndPoint}/${supplierId}/slas`, {
    slaFile: data.sla,
  });
}
export function deleteSla(supplierId, slaId) {
  return http.delete(`${apiEndPoint}/${supplierId}/slas/${slaId}`);
}

export function addContract(supplierId, data) {
  return http.post(`${apiEndPoint}/${supplierId}/contracts/`, {
    contractFile: data.contract,
  });
}

export function deleteContract(supplierId, contractId) {
  return http.delete(`${apiEndPoint}/${supplierId}/contracts/${contractId}`);
}

export function addOnBoardingFile(supplierId, data) {
  return http.post(`${apiEndPoint}/${supplierId}/onboarding-files/`, {
    onBoardingFile: data.onboarding,
  });
}

export function deleteOnBoardingFile(supplierId, onBoardId) {
  return http.delete(
    `${apiEndPoint}/${supplierId}/onboarding-files/${onBoardId}/`
  );
}
