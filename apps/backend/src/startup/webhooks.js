const express = require("express");
const expressApp = express();
const router = express.Router();
const { paymentWebhook } = require("../controllers/payments");
const { logRequest } = require("../middleware/logRequest");
function getUserRouter() {
  router.post("/stripe", paymentWebhook);
  return router;
}

/**
 *
 * @param {expressApp} router
 */
module.exports = function (app) {
  app.use(
    "/webhook",
    express.raw({ type: "application/json" }),
    getUserRouter()
  );
};
