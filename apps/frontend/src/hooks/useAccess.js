import jwtDecode from "jwt-decode";
import { useLocation } from "react-router-dom";
import http from "@/services/httpServices";
import { useApplication } from "@/stores/applicationStore";
import { ACTIONS, IMS_SERVICES, ROLES } from "../rolesAndPermissions";
import { AbilityBuilder, createMongoAbility } from "@casl/ability";

const useAccess = () => {
  const { tokenPair, currentUserData, membershipData } = useApplication();
  const location = useLocation();
  function isLoggedIn() {
    return true;
  }
  function hasLimitedAccess() {
    let query = new URLSearchParams(location.search);
    if (query.get("lat") && query.get("cid") && query.get("organization")) {
      http.setLimitedAccessWithJWT(query.get("lat"), query.get("cid"));
      http.setOrganisationAccess(query.get("organization"));
      return jwtDecode(query.get("lat"));
    }
    return false;
  }
  function _defineAbilityForUser() {
    const user = tokenPair?.accessTokenData?.user;
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    if (!user) return build();
    if (user?.role === ROLES.SUPER_ADMIN) {
      can(ACTIONS.MANAGE, "all");
    } else if (user?.role === ROLES.HEAD_OF_SERVICE) {
      can(ACTIONS.MANAGE, "all");
      cannot(ACTIONS.MANAGE, [
        IMS_SERVICES.LICENSE_MANAGEMENT,
        IMS_SERVICES.ORGANISATION,
        IMS_SERVICES.PARTNERSHIPS,
      ]);
      cannot(
        [ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
        IMS_SERVICES.IAM_GROUPS
      );
    } else if (user?.role === ROLES.BASIC_USER) {
      can(ACTIONS.MANAGE, "all");
      cannot(ACTIONS.MANAGE, [
        IMS_SERVICES.ORGANISATION,
        IMS_SERVICES.AUDIT,
        IMS_SERVICES.INVITATIONS,
        IMS_SERVICES.MEMBERSHIPS,
        IMS_SERVICES.PARTNERSHIPS,
        IMS_SERVICES.LICENSE_MANAGEMENT,
      ]);
      cannot(
        [ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
        [
          IMS_SERVICES.IAM_GROUPS,
          IMS_SERVICES.IAM_PREMISES,
          IMS_SERVICES.AUDIT,
          IMS_SERVICES.COMPLIANCE_TOOL,
        ]
      );
    } else if (user?.role === ROLES.INTERNAL_AUDITOR) {
      can(ACTIONS.READ, "all");
      can(ACTIONS.MANAGE, [IMS_SERVICES.AUDIT, IMS_SERVICES.TASK_MANAGER]);
      cannot(ACTIONS.MANAGE, [
        IMS_SERVICES.ORGANISATION,
        IMS_SERVICES.INVITATIONS,
        IMS_SERVICES.MEMBERSHIPS,
        IMS_SERVICES.PARTNERSHIPS,
        IMS_SERVICES.LICENSE_MANAGEMENT,
      ]);
    } else if (user?.role === ROLES.EXTERNAL_AUDITOR) {
      can(ACTIONS.READ, "all");
      can(ACTIONS.MANAGE, [IMS_SERVICES.AUDIT, IMS_SERVICES.TASK_MANAGER]);
      cannot(ACTIONS.MANAGE, [
        IMS_SERVICES.ORGANISATION,
        IMS_SERVICES.INVITATIONS,
        IMS_SERVICES.MEMBERSHIPS,
        IMS_SERVICES.PARTNERSHIPS,
        IMS_SERVICES.LICENSE_MANAGEMENT,
      ]);
    } else if (user?.role === ROLES.EXTERNAL_USER) {
      can(ACTIONS.MANAGE, "all");
      cannot(ACTIONS.MANAGE, [
        IMS_SERVICES.ORGANISATION,
        IMS_SERVICES.AUDIT,
        IMS_SERVICES.INVITATIONS,
        IMS_SERVICES.MEMBERSHIPS,
        IMS_SERVICES.PARTNERSHIPS,
        IMS_SERVICES.LICENSE_MANAGEMENT,
      ]);
      cannot(
        [ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
        [
          IMS_SERVICES.IAM_GROUPS,
          IMS_SERVICES.IAM_PREMISES,
          IMS_SERVICES.AUDIT,
          IMS_SERVICES.COMPLIANCE_TOOL,
        ]
      );
    }
    return build();
  }
  function authUser(rules) {
    const ability = _defineAbilityForUser();
    return ability.can(rules.action, rules.service);
  }
  function authWalletAccess(userId) {
    return true;
    // let loginData = getCurrentSessionData();
    // return loginData.managedUsers && loginData.managedUsers.length
    //   ? loginData.managedUsers.includes(userId)
    //   : null;
  }
  function authSuperUser() {
    return tokenPair?.accessTokenData?.user.role === ROLES.SUPER_ADMIN;
  }
  function authAdminAccess() {
    return (
      tokenPair?.accessTokenData?.user.role === ROLES.SUPER_ADMIN ||
      tokenPair?.accessTokenData?.user.role === ROLES.HEAD_OF_SERVICE
    );
  }
  function authInternalUser() {
    return (
      tokenPair?.accessTokenData?.user.role === ROLES.SUPER_ADMIN ||
      tokenPair?.accessTokenData?.user.role === ROLES.HEAD_OF_SERVICE ||
      tokenPair?.accessTokenData?.user.role === ROLES.BASIC_USER ||
      tokenPair?.accessTokenData?.user.role === ROLES.INTERNAL_AUDITOR
    );
  }
  function authExternalUser() {
    return (
      tokenPair?.accessTokenData?.user.role === ROLES.EXTERNAL_AUDITOR ||
      tokenPair?.accessTokenData?.user.role === ROLES.EXTERNAL_USER
    );
  }
  function authGlobalAccess() {
    return (
      tokenPair?.accessTokenData?.user.role === ROLES.SUPER_ADMIN ||
      tokenPair?.accessTokenData?.user.role === ROLES.EXTERNAL_AUDITOR ||
      tokenPair?.accessTokenData?.user.role === ROLES.INTERNAL_AUDITOR
    );
  }
  function entityAccessControl(controller) {
    if (!controller.users) controller.users = [];
    if (!controller.effect) return false;
    return controller.effect === "Allow"
      ? controller.users.includes(currentUserData?._id)
      : !controller.users.includes(currentUserData?._id);
  }
  function authComplianceToolkitLicense(name) {
    return membershipData?.organization?.licenses?.complianceTools.includes(
      name
    );
  }
  function authAdditionalModulesLicense(name) {
    return membershipData?.organization?.licenses?.additionalModules.includes(
      name
    );
  }
  function authCarboCalcLicense() {
    return membershipData?.organization?.licenses?.carbocalc;
  }
  function authProjectiMSLicense() {
    return membershipData?.organization?.licenses?.projectims;
  }
  function authGo2eroLicense() {
    return membershipData?.organization?.licenses?.go2ero;
  }
  return {
    isLoggedIn,
    authUser,
    authWalletAccess,
    authGlobalAccess,
    authSuperUser,
    authInternalUser,
    authExternalUser,
    entityAccessControl,
    authAdminAccess,
    hasLimitedAccess,
    authAdditionalModulesLicense,
    authComplianceToolkitLicense,
    authCarboCalcLicense,
    authGo2eroLicense,
    authProjectiMSLicense,
  };
};
export default useAccess;
