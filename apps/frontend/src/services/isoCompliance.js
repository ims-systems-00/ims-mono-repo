import http from "./httpServices";
import { getCurrentUserInfo } from "./userServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/isocompliance`;

export function getIsoModules() {
  return http.get(
    `${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/isoModules/`
  );
}
export function changeComplianceIso27001(data) {
  return http.post(
    `${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/iso27001/`,
    {
      clause: data.clause,
      isCompliant: data.isCompliant,
    }
  );
}
export function changeComplianceIso20000(data) {
  return http.post(
    `${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/iso20000/`,
    {
      clause: data.clause,
      isCompliant: data.isCompliant,
    }
  );
}
export function changeComplianceIso9001(data) {
  return http.post(
    `${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/iso9001/`,
    {
      clause: data.clause,
      isCompliant: data.isCompliant,
    }
  );
}
export function changeComplianceIso27002(data) {
  return http.post(
    `${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/iso27002/`,
    {
      clause: data.clause,
      controlsSelect: data.controlsSelect,
      controlsImplement: data.controlsImplement,
    }
  );
}
export function changeComplianceIso45001(data) {
  return http.post(
    `${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/iso45001/`,
    {
      clause: data.clause,
      isCompliant: data.isCompliant,
    }
  );
}
export function changeComplianceDsptNhs(data) {
  return http.post(
    `${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/dsptNhs`,
    {
      clause: data.clause,
      isCompliant: data.isCompliant,
    }
  );
}
export function addEvidence27002(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso27002/addEvidence`,
    {
      clause: data.clause,
      evidence: data.evidence,
    }
  );
}
export function removeEvidenceFrom27002(clause) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso27002/removeEvidence`,
    { clause }
  );
}
export function addEvidenceTo27001(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso27001/addEvidence`,
    {
      clause: data.clause,
      evidence: data.evidence,
    }
  );
}
export function removeEvidenceFrom27001(clause) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso27001/removeEvidence`,
    { clause }
  );
}
export function addEvidenceTo20000(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso20000/addEvidence`,
    {
      clause: data.clause,
      evidence: data.evidence,
    }
  );
}
export function removeEvidenceFrom20000(clause) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso20000/removeEvidence`,
    { clause }
  );
}
export function addEvidenceTo9001(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso9001/addEvidence`,
    {
      clause: data.clause,
      evidence: data.evidence,
    }
  );
}
export function removeEvidenceFrom9001(clause) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso9001/removeEvidence`,
    { clause }
  );
}
export function addEvidenceTo45001(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso45001/addEvidence`,
    {
      clause: data.clause,
      evidence: data.evidence,
    }
  );
}
export function removeEvidenceFrom45001(clause) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso45001/removeEvidence`,
    { clause }
  );
}
export function addEvidenceToDsptNhs(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/dsptNhs/addEvidence`,
    {
      clause: data.clause,
      evidence: data.evidence,
    }
  );
}
export function removeEvidenceFromDsptNhs(clause) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/dsptNhs/removeEvidence`,
    { clause }
  );
}
export function updateCommentToDsptNhs(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/dsptNhs/updateComment`,
    {
      clause: data.clause,
      comment: data.comment,
    }
  );
}
export function updateCommentTo27001(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso27001/updateComment`,
    {
      clause: data.clause,
      comment: data.comment,
    }
  );
}
export function updateCommentTo20000(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso20000/updateComment`,
    {
      clause: data.clause,
      comment: data.comment,
    }
  );
}
export function updateCommentTo27002(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso27002/updateComment`,
    {
      clause: data.clause,
      comment: data.comment,
    }
  );
}
export function updateCommentTo45001(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso45001/updateComment`,
    {
      clause: data.clause,
      comment: data.comment,
    }
  );
}
export function updateCommentTo9001(data) {
  return http.put(
    `${apiEndPoint}/${
      getCurrentUserInfo().organizationId._id
    }/iso9001/updateComment`,
    {
      clause: data.clause,
      comment: data.comment,
    }
  );
}
