const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { models } = require("../../models");
const TextProcessor = require("../../services/textProcessor");
const Trigger = require("../../services/triggers");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
function _traceMentions(object, fields) {
  let mentions = {};
  for (let field of fields) {
    if (!object[field.name])
      throw new Error("object must contain the specified field for tracking");
    logger.info("finding for tracking...");
    let rawTextEditorDataStrucure = JSON.parse(object[field.name]);
    let textProcessor = new TextProcessor(rawTextEditorDataStrucure);
    mentions[field.name] = textProcessor.parseMentions();
  }
  return mentions;
}
exports.consume = async (job) => {
  let connection = job.data?.accessControl;
  let User = models.users(connection);
  let trigger = new Trigger(connection);
  try {
    /**
     * follwoing piece of code tries to find the new mentions only
     */
    let allMentionsInThisRequest = _traceMentions(
      job.data.requestBody,
      job.data.bodyFields
    );
    let allMentionsInPrevData = {};
    if (job.data.prevDataFields)
      allMentionsInPrevData = _traceMentions(
        job.data.prevData,
        job.data.prevDataFields
      );
    for (let fieldName of Object.keys(allMentionsInThisRequest)) {
      let finalMentions = [];
      if (!allMentionsInPrevData[fieldName]) {
        finalMentions = allMentionsInThisRequest[fieldName];
      } else {
        let preExistingMentions = allMentionsInPrevData[fieldName].map(
          (item) => item?.data?._id
        );
        finalMentions = allMentionsInThisRequest[fieldName].filter(
          (item) => !preExistingMentions.includes(item?.data?._id)
        );
      }
      let screenIdentifier = finalMentions.length
        ? finalMentions[0].data?.screenIdentifier
        : "";
      finalMentions = await User.find({
        _id: { $in: finalMentions.map((mention) => mention.data._id) },
      });
      let notificationData = {
        ...job.data.prevData,
        mentionedUsers: finalMentions,
        user: job.data.user,
        screenIdentifier,
        place: job.data.bodyFields.find((filed) => filed.name === fieldName),
      };
      mainChannel.topic(SERVER_EVENTS_BUS.USER_MENTIONED_EVENT).emit({
        accessControl: connection,
        notificationData,
      });
      // trigger.sendNotification("userMentionedEvent", notificationData, {
      //   email: true,
      // });
    }
  } catch (error) {
    logger.info(error);
    logger.info("invalid data skiping tracking");
  }
};
exports.completeAction = async (job) => {};
