const router = require("express").Router();
const {
  ACTIONS,
  IMS_SERVICES,
} = require("@ims-systems-00/ims-core/lib/constants");
const {
  createInvitation,
  getInvitation,
  listInvitations,
  resendInvitation,
  removeInvitation,
  acceptInvitation,
} = require("../../../controllers/invitation");
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations/invitation");
const { enforceRbac } = require("../../../middleware/enforceRbac");
const validateBody = validate("body");
const verifyInvitationToken = require("../../../middleware/invitationTokenVerify");
router.post(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.INVITE,
    }),
    validateBody(validations.createInvitation),
  ],
  createInvitation
);

router.post("/acceptance", [verifyInvitationToken], acceptInvitation);

router.get("/:id", [], getInvitation);
router.get("/", [], listInvitations);

router.put(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.INVITE,
    }),
  ],
  resendInvitation
);

router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.USERS,
      action: ACTIONS.INVITE,
    }),
  ],
  removeInvitation
);

module.exports = router;
