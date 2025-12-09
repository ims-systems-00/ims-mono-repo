import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";
moment().format();
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/assets`;

export function createHardwareAsset(hardwareAsset) {
  return http.post(`${apiEndPoint}/hardwares`, {
    group: hardwareAsset.group.value,
    name: hardwareAsset.name,
    tag: hardwareAsset.tag,
    owner: hardwareAsset.owner.value,
    tagsAndCategories: hardwareAsset.tagsAndCategories.value,
    assignedDate: new Date(
      moment(hardwareAsset.assignedDate, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    returnDate: new Date(
      moment(hardwareAsset.returnDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    destructionDate: new Date(
      moment(hardwareAsset.destructionDate, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    cost: hardwareAsset.cost,
  });
}
export function getHardwareAssets({ query }) {
  return http.get(`${apiEndPoint}/hardwares/?${query}`);
}
export function getHardwareAsset(assetId) {
  return http.get(`${apiEndPoint}/hardwares/${assetId}`);
}

export function updateHardwareAsset(assetId, hardwareAsset) {
  return http.put(`${apiEndPoint}/hardwares/${assetId}`, {
    name: hardwareAsset.name,
    tag: hardwareAsset.tag,
    owner: hardwareAsset.owner.value,
    tagsAndCategories: hardwareAsset.tagsAndCategories.value,
    assignedDate: new Date(
      moment(hardwareAsset.assignedDate, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    returnDate: new Date(
      moment(hardwareAsset.returnDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    destructionDate: new Date(
      moment(hardwareAsset.destructionDate, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    cost: hardwareAsset.cost,
  });
}
export function deleteHardwareAsset(assetId) {
  return http.delete(`${apiEndPoint}/hardwares/${assetId}`);
}
export function mapToHardwareAssetModel(hardwareAsset) {
  return {
    data: {
      group: {
        value: hardwareAsset.group?._id,
        label: hardwareAsset.group?.name,
      },
      tagsAndCategories: {
        value: hardwareAsset.tagsAndCategories?._id,
        label: hardwareAsset.tagsAndCategories?.name,
      },
      name: hardwareAsset.name,
      tag: hardwareAsset.tag,
      owner: hardwareAsset.owner
        ? {
            value: hardwareAsset.owner._id,
            label: hardwareAsset.owner.name,
          }
        : {
            value: null,
            label: "Select owner",
          },
      returnDate: hardwareAsset.returnDate
        ? moment(hardwareAsset.returnDate).format("D/M/Y")
        : "",
      assignedDate: hardwareAsset.assignedDate
        ? moment(hardwareAsset.assignedDate).format("D/M/Y")
        : "",
      destructionDate: hardwareAsset.destructionDate
        ? moment(hardwareAsset.destructionDate).format("D/M/Y")
        : "",
      cost: hardwareAsset.cost,
    },
    errors: {},
  };
}
export function createSoftwareAsset(softwareAsset) {
  return http.post(`${apiEndPoint}/softwares`, {
    group: softwareAsset.group.value,
    name: softwareAsset.name,
    numberOfLicenses: softwareAsset.numberOfLicenses,
    numberOfInstalls: softwareAsset.numberOfInstalls,
    cost: softwareAsset.cost,
    docs: softwareAsset.docs,
    tagsAndCategories: softwareAsset.tagsAndCategories.value,
  });
}
export function getSoftwareAssets({ query }) {
  return http.get(`${apiEndPoint}/softwares/?${query}`);
}
export function getSoftwareAsset(assetId) {
  return http.get(`${apiEndPoint}/softwares/${assetId}`);
}
export function updateSoftwareAsset(assetId, softwareAsset) {
  return http.put(`${apiEndPoint}/softwares/${assetId}`, {
    name: softwareAsset.name,
    numberOfLicenses: softwareAsset.numberOfLicenses,
    numberOfInstalls: softwareAsset.numberOfInstalls,
    cost: softwareAsset.cost,
    docs: softwareAsset.docs,
    tagsAndCategories: softwareAsset.tagsAndCategories.value,
  });
}
export function addSoftwareKeys(assetId, data) {
  return http.post(`${apiEndPoint}/softwares/${assetId}/keys`, {
    key: {
      value: data.key,
    },
  });
}
export function deleteSoftwareKeys(assetId, keyId) {
  return http.delete(`${apiEndPoint}/softwares/${assetId}/keys/${keyId}`);
}
export function addSoftwareDoc(assetId, data) {
  return http.post(`${apiEndPoint}/softwares/${assetId}/documents`, {
    doc: data.attachment,
  });
}
export function deleteSoftwareDoc(assetId, documentId) {
  return http.delete(
    `${apiEndPoint}/softwares/${assetId}/documents/${documentId}`
  );
}
export function deleteSoftwareAsset(assetId) {
  return http.delete(`${apiEndPoint}/softwares/${assetId}`);
}
export function mapToSoftwareAssetModel(softwareAsset) {
  return {
    data: {
      group: {
        value: softwareAsset.group?._id,
        label: softwareAsset.group?.name,
      },
      tagsAndCategories: {
        value: softwareAsset.tagsAndCategories?._id,
        label: softwareAsset.tagsAndCategories?.name,
      },
      name: softwareAsset.name,
      numberOfLicenses: softwareAsset.numberOfLicenses,
      numberOfInstalls: softwareAsset.numberOfInstalls,
      cost: softwareAsset.cost,
      docs: softwareAsset.docs,
    },
    errors: {},
  };
}
export function mapToSoftwareKeysModel(data) {
  return {
    data: {
      key: data.value,
    },
    errors: {},
  };
}
export function createPeopleAsset(people) {
  return http.post(`${apiEndPoint}/peoples`, {
    group: people.group.value,
    name: people.name,
    role: people.role,
    responsibility: people.responsibility,
    skill: people.skill,
    tagsAndCategories: people.tagsAndCategories.value,
  });
}
export function getPeopleAssets({ query }) {
  return http.get(`${apiEndPoint}/peoples/?${query}`);
}
export function getPeopleAsset(assetId) {
  return http.get(`${apiEndPoint}/peoples/${assetId}`);
}
export function updatePeopleAsset(assetId, people) {
  return http.put(`${apiEndPoint}/peoples/${assetId}`, {
    name: people.name,
    role: people.role,
    responsibility: people.responsibility,
    skill: people.skill,
    tagsAndCategories: people.tagsAndCategories.value,
  });
}
export function deletePeopleAsset(assetId) {
  return http.delete(`${apiEndPoint}/peoples/${assetId}`);
}
export function mapToPeopleAssetModel(peopleAsset) {
  return {
    data: {
      group: {
        value: peopleAsset.group?._id,
        label: peopleAsset.group?.name,
      },
      name: peopleAsset.name,
      role: peopleAsset.role,
      responsibility: peopleAsset.responsibility,
      skill: peopleAsset.skill,
      tagsAndCategories: {
        value: peopleAsset.tagsAndCategories?._id,
        label: peopleAsset.tagsAndCategories?.name,
      },
    },
    errors: {},
  };
}
export function createPremiseAsset(premiseAsset) {
  return http.post(`${apiEndPoint}/premises/`, {
    group: premiseAsset.group.value,
    name: premiseAsset.name,
    location: premiseAsset.location,
    address: premiseAsset.address,
    cost: premiseAsset.cost,
    tagsAndCategories: premiseAsset.tagsAndCategories.value,
  });
}
export function getPremiseAssets({ query }) {
  return http.get(`${apiEndPoint}/premises/?${query}`);
}
export function getPremiseAsset(assetId) {
  return http.get(`${apiEndPoint}/premises/${assetId}`);
}
export function updatePremiseAsset(assetId, premiseAsset) {
  return http.put(`${apiEndPoint}/premises/${assetId}`, {
    name: premiseAsset.name,
    location: premiseAsset.location,
    address: premiseAsset.address,
    cost: premiseAsset.cost,
    tagsAndCategories: premiseAsset.tagsAndCategories.value,
  });
}
export function deletePremiseAsset(assetId) {
  return http.delete(`${apiEndPoint}/premises/${assetId}`);
}
export function mapToPremiseAssetModel(premiseAsset) {
  return {
    data: {
      group: {
        value: premiseAsset.group?._id,
        label: premiseAsset.group?.name,
      },
      name: premiseAsset.name,
      address: premiseAsset.address,
      location: premiseAsset.location,
      cost: premiseAsset.cost,
      tagsAndCategories: {
        value: premiseAsset.tagsAndCategories?._id,
        label: premiseAsset.tagsAndCategories?.name,
      },
    },
    errors: {},
  };
}

export function createInformation(information) {
  return http.post(`${apiEndPoint}/informations`, {
    group: information.group.value,
    informationInventory: information.informationInventory,
    title: information.title,
    owner: information.owner.value,
    storageLocation: information.storageLocation,
    format: information.format,
    link: information.link,
    cost: information.cost,
    tagsAndCategories: information.tagsAndCategories.value,
  });
}

export function updateInformation(informationId, information) {
  return http.put(`${apiEndPoint}/informations/${informationId}`, {
    informationInventory: information.informationInventory,
    title: information.title,
    owner: information.owner.value,
    storageLocation: information.storageLocation,
    format: information.format,
    link: information.link,
    cost: information.cost,
    tagsAndCategories: information.tagsAndCategories.value,
  });
}
export function getInformations({ query }) {
  return http.get(`${apiEndPoint}/informations/?${query}`);
}
export function getInformation(informationId) {
  return http.get(`${apiEndPoint}/informations/${informationId}`);
}
export function deleteInformationAsset(informationId) {
  return http.delete(`${apiEndPoint}/informations/${informationId}`);
}

export function mapToInformationAssetModel(informationAsset) {
  return {
    data: {
      group: {
        value: informationAsset.group?._id,
        label: informationAsset.group?.name,
      },
      informationInventory: informationAsset.informationInventory,
      title: informationAsset.title,
      format: informationAsset.format,
      storageLocation: informationAsset.storageLocation,
      link: informationAsset.link,
      owner: informationAsset.owner
        ? {
            value: informationAsset.owner._id,
            label: informationAsset.owner.name,
          }
        : {
            value: null,
            label: "Select owner",
          },
      cost: informationAsset.cost,
      tagsAndCategories: {
        value: informationAsset.tagsAndCategories?._id,
        label: informationAsset.tagsAndCategories?.name,
      },
    },
    errors: {},
  };
}
