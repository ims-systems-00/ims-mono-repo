require("dotenv").config();
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { Invitation } = require("../src/services/invitation");
const { connectDataBase } = require("../src/config/databaseManager");
const {
  RequestUserAccessControlProvider,
} = require("../src/helpers/requestAccessControlProvider");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxhdXJhLWphbmVAYm9tLXN5c3RlbXMuY28udWsiLCJvcmdhbml6YXRpb24iOiI2N2ExYWJkMGNjZGNmMDZlZmFhNWRhMjkiLCJzZW5kZXJOYW1lIjoiTUQgUmV5YWQgSG9zc2FpbiIsIm9yZ2FuaXphdGlvbk5hbWUiOiJpbnRlcmZhY2UgbnJtIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaWF0IjoxNzM4NjQ5NjI4LCJleHAiOjE3Mzg5MDg4Mjh9.9_YebPY6vVD_dtQkR8_4GhSpFJlbykErR0iZfalaH6w";

(async function () {
  try {
    await connectDataBase();
    const reqAccessControl = new RequestUserAccessControlProvider();
    const invitation = new Invitation(reqAccessControl);
    await invitation.acceptInvitation(token);
  } catch (err) {
    logger.error("error syncing tools: ", err);
  }
  process.exit(0);
})();
