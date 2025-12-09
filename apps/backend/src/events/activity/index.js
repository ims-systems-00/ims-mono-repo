const eventsHandlers = {
  ...require("./handlers/document-version-added"),
  ...require("./handlers/authorisation-request-sent-for-document"),
  ...require("./handlers/signature-request-sent-for-document"),
  ...require("./handlers/document-signed-by-the-person"),
  ...require("./handlers/document-revision-added"),
  ...require("./handlers/auth-document-reviewed-by-the-person"),
  ...require("./handlers/document-conformance"),
  ...require("./handlers/document-shared-via-email"),
  ...require("./handlers/control-became-compliant"),
  ...require("./handlers/nudge-a-person"),
  ...require("./handlers/attachment-attached-to-a-data"),
};
module.exports = eventsHandlers;
