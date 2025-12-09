const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getAllActiveUsers,
  deleteUser,
  addUserToGroup,
  removeUserFromFroup,
  getUserWithClassifiedInfo,
  getUserWithBasicInfo,
  updateUserInfo,
  resetPassword,
  changeOldPassword,
  changeProfileImage,
  changeImsSystemsAccessStatus,
  authUserRoleLicense,
  assignComplianceToolKit,
  updateExpiredUsersStatus,
  signPolicy,
  getProfileImage,
  changePreferences,
  authCreatePermission,
  useUserLicense,
  useRoleLicense,
  freeRoleLicense,
  addWorkingLocation,
  removeWorkingLocation,
  ownershipChecks,
  transferOwnership,
  changeSignature,
} = require("../../controllers/users");

const { validate } = require("../../middleware/validator");
const validateBody = validate("body");
// auth middlewares ....
const { enforceRbac } = require("../../middleware/enforceRbac");
const { userValidation } = require("../../validations/index");

const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const { authOrgAccess } = require("../../middleware/authOrgAccess");

router.post(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  authCreatePermission,
  validateBody(userValidation.create),
  createUser,
  useUserLicense
);

router.post(
  "/expired-users",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateExpiredUsersStatus
);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
    authOrgAccess,
  ],
  getAllUsers
);

router.put(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  validateBody(userValidation.update),
  updateUserInfo
);

router.put(
  "/:id/ims-access",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  changeImsSystemsAccessStatus
);

router.put(
  "/reset-password",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  resetPassword
);

router.put(
  "/:id/change-password/",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  changeOldPassword
);

router.post(
  "/:id/locations/",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  validateBody(userValidation.addLocaion),
  addWorkingLocation
);

router.delete(
  "/:id/locations/:location_id",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeWorkingLocation
);

router.put(
  "/:id/policy-signature/:policy_id",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  signPolicy
);
router.get(
  "/:id/profile-image/",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getProfileImage
);

router.put(
  "/:id/profile-image",
  [
    validateBody(userValidation.changeProfileImage),
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  changeProfileImage
);
router.put(
  "/:id/signature",
  [
    validateBody(userValidation.changeSignature),
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  changeSignature
);

router.put(
  "/:id/preferences",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  changePreferences
);

router.get(
  "/:id/basic-info",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.USERS,
    //   action: ACTIONS.READ,
    //   effect: EFFECTS.ALLOW,
    // }),
  ],
  getUserWithBasicInfo
);

router.get(
  "/:id/classified-info",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.USERS,
    //   action: ACTIONS.READ,
    //   effect: EFFECTS.ALLOW,
    // }),
  ],
  getUserWithClassifiedInfo
);

router.get(
  "/active",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
    authOrgAccess,
  ],
  getAllActiveUsers
);

router.post(
  "/:id/groups/",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addUserToGroup
);

router.delete(
  "/:id/groups/:group_id",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
    authOrgAccess,
  ],
  removeUserFromFroup
);

router.put(
  "/:id/compliance-tools",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  assignComplianceToolKit
);
router.post(
  "/:id/ownership-transfer",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  transferOwnership
);
router.post(
  "/:id/ownership-checks",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  ownershipChecks
);
router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteUser
);

module.exports = router;
