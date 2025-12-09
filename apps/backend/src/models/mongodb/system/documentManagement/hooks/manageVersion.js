/**
 * this hook publishes the latest version in the repository and points the older
 * version to historical data.
 * @param {import("mongoose").Schema} schema
 */
const { v4: uuidv4 } = require("uuid");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
async function _publish_version_hook(next) {
  try {
    /**
     * we are ensuring the hook does not handle multiple instances of save. refer to async issues
     * with pre save hook for more information
     */
    if (this._versionPublishProcessed) {
      logger.info("already publish processed. skipping...");
      return next();
    }
    if (
      this.status === "Published" &&
      this.type === "document" &&
      !this.deleteMarker.status
    ) {
      let prevVersion = await this.constructor.findOneAndUpdate(
        {
          repository: this.repository?._id || this.repository,
          parentNode: this.parentNode?._id || this.parentNode,
          status: this.status,
          name: this.name,
          "deleteMarker.status": false,
        },
        {
          $set: { status: "Archived" },
        },
        {
          new: true,
        }
      );
      logger.info("logging version query data", { prevVersion: prevVersion });
      if (prevVersion) {
        logger.info("previous version found", {
          dvID: prevVersion.documentData.dvID,
        });
        this.documentData.dvID = prevVersion.documentData.dvID;
        this.documentData.dvID++;
        logger.info("current version", { dvID: this.documentData.dvID });
      } else {
        this.documentData.dvID = 1;
        logger.info("Previous version not found, considering current version", {
          dvID: this.documentData.dvID,
        });
      }
      this._versionPublishProcessed = true;
    }
  } catch (err) {
    logger.info(err);
  }
  return next();
}
async function _manage_thread_hook(next) {
  if (this.type !== "document") {
    logger.info("Not a document. skipping manage thread hook...");
    return next();
  }
  /**
   * following has no impact if the hook runs multiple times...
   */
  if (this._trailTrackingProcessed) {
    logger.info("already trail tracking processed. skipping...");
    return next();
  }
  try {
    let existingVersion = await this.constructor.findOne({
      repository: this.repository?._id || this.repository,
      parentNode: this.parentNode?._id || this.parentNode,
      name: this.name,
      "deleteMarker.status": false,
    });
    if (existingVersion) {
      logger.info("attaching to the trail...");
      this.documentData.threadId = existingVersion.documentData.threadId;
    } else {
      logger.info("Creating new trail...");
      this.documentData.threadId = uuidv4();
    }
    this._trailTrackingProcessed = true;
  } catch (err) {
    logger.info(err);
  }
  return next();
}
function manageVersion(schema) {
  schema.pre("save", _publish_version_hook);
  schema.pre("save", _manage_thread_hook);
}
module.exports = { manageVersion };
