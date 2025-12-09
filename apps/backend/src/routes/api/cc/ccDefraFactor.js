const router = require("express").Router();

const { listCcDefraFactor } = require("../../../controllers/cc");

router.get("/defra-factors/", [], listCcDefraFactor);

module.exports = router;
