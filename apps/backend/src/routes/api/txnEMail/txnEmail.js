const router = require("express").Router();

const {
  createtxnEmail,
  gettxnEmail,
  listtxnEmails,
  hardRemovetxnEmail,
} = require("../../../controllers/txnEmail");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");

const validateBody = validate("body");

router.post(
  "/",
  [validateBody(validations.txnEmailValidation.createtxnEmail)],
  createtxnEmail
);
router.get("/:id", [], gettxnEmail);
router.get("/", [], listtxnEmails);
router.delete("/:id", [], hardRemovetxnEmail);

module.exports = router;
