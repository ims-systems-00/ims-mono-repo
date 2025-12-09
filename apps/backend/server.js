require("dotenv").config();
const paintConsole = require("./src/config/paintConsole");
global.console = paintConsole;
const express = require("express");
const expressRateLimit = require("express-rate-limit");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const app = express();
const upload = require("express-fileupload");
const corsProtection = require("./src/middleware/corsProtection");
const { logRequest } = require("./src/middleware/logRequest");
const wrokerController = require("./src/controllers/workerpool/controler");
const { secureQuery } = require("./src/middleware/trimQuery");
const { formatResponse } = require("./src/middleware/formatResponse");
const {
  register: registerServerEventListeners,
} = require("./src/events/register-all-listeners");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const os = require("os");
const cluster = require("cluster");
const { errorHandler } = require("./src/middleware/errorHandler");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const {
  actionOnUnhandled,
} = require("./src/helpers/errors/unhandleRejections");
const { processFormatedText } = require("./src/middleware/processFormatedText");
const { connectDataBase } = require("./src/config/databaseManager");
const {registerServereventListenersV2} = require("./src/eventsV2/index");
const { connectRedis } = require("./src/redis/redisClient");
const nCpus = os.cpus().length;
// Connect Database
connectDataBase();
require("./src/startup/webhooks")(app);
app.use(
  expressRateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: "To many requests. Please try againg later.",
  })
);
app.use(xssClean());
app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
app.use(express.json({ limit: "200mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(corsProtection);
// app.use(hpp());
app.use(secureQuery);
app.use(formatResponse);
app.use(compression());
if (process.env.NODE_ENV !== "production") {
  app.use(logRequest);
}
app.use("/serverhealth", require("./src/routes/sites/serverhealth"));

app.use(upload());

//events
registerServereventListenersV2(app);
// Define Routes...
app.use(
  "/public/api/v3/document-repositories",
  require("./src/routes/api/documentManagement/public")
);
require("./src/startup/adminRoutes")(app);
require("./src/startup/apiRoutes")(app);
require("./src/startup/apiDocsRoutes")(app);
app.use(processFormatedText);
app.use(errorHandler);

app.get("*", (req, res) => {
  return res.redirect("/serverhealth");
});

async function startServer() {
  try {
    if (process.env.WORKER_POOL_ENABLED === "1") {
      let options = { minWorkers: "max" };
      await wrokerController.init(options);
      let workerPool = wrokerController.get();
      workerPool.runSchedules();
    }
  } catch (err) {
    logger.info(err);
  }
  const PORT = process.env.PORT || 8000;
  const httpServer = app.listen(PORT, () =>
    logger.info(`Server ${process.pid} started @ port ${PORT}`)
  );
  const socket = require("./src/socket/webSocket").init(httpServer);
  socket.on("connection", (client) => {
    logger.info("Client connected...", "ClientId", client.id);
    require("./src/socket/subscribers/user.subscribtion")(client);
    require("./src/socket/subscribers/logger.subscription")(client);
    client.on("disconnect", () =>
      logger.warn("Client disconnected...", "ClientId", client.id)
    );
  });
  registerServerEventListeners();
}
(async () => {
  // if (cluster.isMaster && process.env.NODE_ENV === "production") {
  //   for (let i = 0; i < nCpus; i++) {
  //     cluster.fork();
  //   }
  // } else {
  //   startServer();
  //   actionOnUnhandled();
  //   logger.info("number of cpu available: " + nCpus);
  // }
  startServer();
  //connect redis
  await connectRedis();
  actionOnUnhandled();
  logger.info("number of cpu available: " + nCpus);
})();
