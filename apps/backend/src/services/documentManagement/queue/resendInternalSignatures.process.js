const { models } = require("../../../models");
const { Token } = require("../../tokenManagement");
const Trigger = require("../../triggers");
const { SERVER_EVENTS } = require("../../../events/constants");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const eventEmitter = require("../../../events/event-manager").getInstance();

const { mainChannel } = require("../../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../../eventsV2/topicsName");

exports.consume = async (job) => {
  let connection = job.data?.accessControl;
  let User = models.users(connection);
  let DocumentRepository = models.documentrepositories(connection);
  let DocumentSignatures = models.documentsignatures(connection);
  let DocumentTree = models.documenttrees(connection);
  let trigger = new Trigger(connection);
  let i = 0;
  let length = job.data?.signatureIds?.length;
  try {
    async function _resend(id) {
      let review = await DocumentSignatures.findOne({
        _id: id,
      });
      if (review) {
        let document = await DocumentTree.findOne({ _id: review?.node });
        document = await DocumentTree.populateNode(document);
        let repository = await DocumentRepository.findOne({
          _id: review?.repository,
        });
        repository = await DocumentRepository.populateRepository(repository);
        let securityToken = await Token.signToken(
          {
            rid: review.repository,
            nid: review.node,
            sid: review._id,
            uid: review.user.internalRef,
          },
          process.env.JWT_KEY,
          { expiresIn: "2 days" }
        );
        review.securityToken = securityToken;
        await review.save();
        let user = await User.findById({
          _id: review.user.internalRef,
        });
        mainChannel
          .topic(SERVER_EVENTS_BUS.NEW_SIGNATURE_FOR_DOCUMENT_EVENT)
          .emit({
            repository,
            document,
            signature: review,
            users: [user],
          });

        // trigger.sendNotification(
        //   "newSignatureForDocumentEvent",
        //   {
        //     repository,
        //     document,
        //     signature: review,
        //     users: [user],
        //   },
        //   {
        //     email: true,
        //   }
        // );
        mainChannel.topic(SERVER_EVENTS.DOCUMENT_SIGNATURE_REQUESTD).emit({
          accessControl: connection,
          document: document,
          signatureType: "Internal",
          users: [user._id],
          message: review.message,
          createdBy: job.data.sender,
        });
        // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_SIGNATURE_REQUESTD, {
        //   accessControl: connection,
        //   document: document,
        //   signatureType: "Internal",
        //   users: [user._id],
        //   message: review.message,
        //   createdBy: job.data.sender,
        // });
      }
    }
    for (let i = 0; i < length; i++) {
      await _resend(job?.data?.signatureIds[i]);
    }
  } catch (error) {
    logger.info(error);
  }
};
exports.completeAction = async (job) => {};
