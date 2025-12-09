import { useState } from "react";
import { refreshProfileCache } from "@/services/userServices";
import { refreshGroupsCache } from "@/services/iamGroupServices";
import { getGroups } from "@/services/iamGroupServices";
import { getUserWithBasicInfo } from "@/services/userServices";
import { IMS_POLICIES } from "@/rolesAndPermissions";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentSessionData } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import { getOrganization } from "@/services/organizationService";
import { refreshOrganisationCache } from "@/services/organizationService";
import { getActiveLog } from "@/services/wallet/worklogServices";
import { refreshWorkLogCache } from "@/services/wallet/worklogServices";
import { useHistory } from "react-router-dom";
const useCache = () => {
  const history = useHistory();
  let [cacheResponses, setCacheResponses] = useState({
    groupsResponse: null,
    profileResponse: null,
    organisationResponse: null,
    workLogResponse: null,
  });

  async function cacheData() {
    try {
      let [
        groupsResponse,
        profileResponse,
        organisationResponse,
        workLogResponse,
      ] = await Promise.all([
        getGroups({ query: "page=1&size=30" }),
        getUserWithBasicInfo(getCurrentSessionData().user._id),
        getOrganization(),
        getActiveLog(),
      ]);
      setCacheResponses({
        groupsResponse,
        profileResponse,
        organisationResponse,
        workLogResponse,
      });
      refreshGroupsCache(
        JSON.stringify(
          groupsResponse.data?.iamGroups.filter(
            (group) =>
              group.policy?.name !== IMS_POLICIES.IMS_COMPLIANCE_FUNCTION
          )
        ),
        JSON.stringify(
          groupsResponse.data.iamGroups.filter(
            (group) =>
              group?.policy?.name === IMS_POLICIES.IMS_COMPLIANCE_FUNCTION
          )
        ),
        JSON.stringify(
          groupsResponse.data.iamGroups.filter((group) =>
            group.userLicenses.complianceTools.includes(IMS_SERVICES.CQC)
          )
        )
      );
      refreshProfileCache(profileResponse.data.user);
      refreshOrganisationCache(
        JSON.stringify(organisationResponse.data.organization)
      );
      refreshWorkLogCache(JSON.stringify(workLogResponse.data.worklog));
    } catch (ex) {
      // history.push(`/auth/login`);
      imsLogger("useCache", ex);
    }
  }
  return {
    cacheResponses,
    cacheData,
  };
};
export default useCache;
