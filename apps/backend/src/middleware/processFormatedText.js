const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const usermentionsQueue = require("../schedules/queues/usermentions.queue");
/**
 * the follwing middleware is built to always run after any controller logic.
 * so this middleware is not useful only after controllers. please never send a
 * response to client from this middleware. this action is restricted to code here.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const processFormatedText = (req, res, next) => {
  if (["POST", "PUT"].includes(req.method)) {
    if (
      !req?.accessControl?.user?._id &&
      !req?.accessControl?.externalID?.email
    )
      return res
        .status(400)
        .json({ message: "User must have a valid session." });
    if (!res.locals.formatedTextTracking) {
      logger.info("Format text object not specified, skiping text parsing...");
      return next();
    }
    let { bodyFields, prevDataFields, prevData } =
      res.locals.formatedTextTracking;
    if (!bodyFields) {
      logger.info("tracking fields not specified, skiping text parsing...");
      return next();
    }
    bodyFields = Array.isArray(bodyFields) ? bodyFields : [bodyFields];
    if (prevDataFields) {
      prevDataFields = Array.isArray(prevDataFields)
        ? prevDataFields
        : [prevDataFields];
    }
    usermentionsQueue.produce({
      accessControl: req.accessControl,
      user: req.accessControl.user,
      requestBody: req.body,
      bodyFields,
      prevDataFields,
      prevData,
    });
  }
  next();
};
module.exports = { processFormatedText };
