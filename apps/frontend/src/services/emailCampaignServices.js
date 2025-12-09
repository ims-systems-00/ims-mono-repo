import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/emailcampaign`;

export function createCampaign(data, savedCampaign) {
  let attachments = savedCampaign ? savedCampaign.attachments : [];
  return http.post(`${apiEndPoint}/`, {
    bundle: data.bundle ? data.bundle : null,
    group: data.group.value,
    name: data.name,
    target: data.target.map((target) => target.value),
    customAudience: data.customAudience.map((customer) => customer.value),
    subject: data.subject,
    body: data.body,
    attachments: data.attachments,
    createdBy: getCurrentSessionData().user._id,
  });
}

export function updateCampaign(dataId, data) {
  return http.put(`${apiEndPoint}/${dataId}`, {
    bundle: data.bundle,
    name: data.name,
    group: data.group.value,
    target: data.target.map((target) => target.value),
    customAudience: data.customAudience.map((customer) => customer.value),
    subject: data.subject,
    body: data.body,
    attachments: data.attachments,
  });
}

export function getCampaigns({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getRecipients(campaignId, { query }) {
  return http.get(`${apiEndPoint}/${campaignId}/recipients/?${query}`);
}

export function getCampaign(campaignId) {
  return http.get(`${apiEndPoint}/${campaignId}`);
}

export function sendCampaign(campaignId) {
  return http.put(`${apiEndPoint}/${campaignId}/schedule`);
}
export function deleteCampaign(campaignId) {
  return http.delete(`${apiEndPoint}/${campaignId}`);
}
export function getCampaignOverview(campaignId) {
  return http.get(`${apiEndPoint}/${campaignId}/overview`);
}
export function closeCampaign(campaignId, { query }) {
  return http.put(`${apiEndPoint}/${campaignId}/activity-status/?${query}`);
}

export function mapToCampaignModel(campaign) {
  return {
    data: {
      group: {
        value: campaign.group?._id,
        label: campaign.group?.name,
      },
      target: campaign.target?.map((target) => ({
        value: target,
        label: target,
      })),
      customAudience: campaign.customAudience.map((customer) => ({
        value: customer._id,
        label: `${customer.reference} ${customer.name}`,
      })),
      name: campaign.name,
      bundle: campaign.bundle,
      subject: campaign.subject,
      body: campaign.body,
      attachments: campaign.attachments,
    },
    errors: {},
  };
}
