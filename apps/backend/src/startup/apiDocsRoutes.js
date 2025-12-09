const express = require("express");
const expressApp = express();
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "iMS Systems API",
      version: "1.0.0",
      description: "Compliance Simplified, Business Amplified.",
    },
    servers: [
      {
        url: process.env.SERVER_URL + "/api/v2",
        description: "Client API",
      },
    ],
  },
  apis: [
    path.join(__dirname, "..", "/routes/api/*.api.yaml"),
    path.join(__dirname, "..", "/routes/api/*/*.api.yaml"),
  ],
});
/**
 *
 * @param {expressApp} router
 */
module.exports = function (app) {
  if (process.env.NODE_ENV !== "production") {
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "iMS Systems API",
        customCss: ".swagger-ui .topbar { display: none }",
        customfavIcon: "https://imssystems.tech/favicon.ico",
      })
    );
  }
};
