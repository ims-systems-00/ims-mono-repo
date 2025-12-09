const express = require("express");
const {
  deserializeUser,
} = require("../../middleware/imsadmin/deserializeiMSAdmin");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use(deserializeUser);
router.use("/tenants", require("./tenants"));
router.use("/buildrequests", require("./buildrequests"));
router.use("/systemnotices", require("./systemnotice"));

module.exports = router;
