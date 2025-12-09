const { models } = require("../../../models");
const { Token } = require("../../tokenManagement");
const Trigger = require("../../triggers");
const docsignatureListners = require("../../../socket/listeners/documentSignature.listener");
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
  let length = job.data?.users?.length;
  let successfullUserIds = [];
  try {
    /**
     * get repository and document information...
     */
    let repository = await DocumentRepository.findOne({
      _id: job?.data?.repository,
    });
    repository = await DocumentRepository.populateRepository(repository);
    let document = await DocumentTree.findOne({ _id: job?.data?.node });
    document = await DocumentTree.populateNode(document);
    /**
     * create a review for a user...
     */

    async function _createReview(data) {
      let review = await DocumentSignatures.findOne({
        repository: job?.data?.repository,
        node: job?.data?.node,
        "user.internalRef": data?.user,
        type: "Internal",
      });
      if (review) {
        logger.info(`${data?.user} already exists`);
        return;
      }
      let signature = new DocumentSignatures({
        organization: connection.user.organizationId,
        type: "Internal",
        message: job?.data?.message,
        repository: job.data?.repository,
        node: job.data?.node,
        user: {
          internalRef: data?.user,
        },
      });
      let securityToken = await Token.signToken(
        {
          rid: job.data?.repository,
          nid: job.data?.node,
          sid: signature._id,
          uid: data.user,
        },
        process.env.JWT_KEY,
        { expiresIn: "2 days" }
      );
      signature.securityToken = securityToken;

      // Set signature locations
      signature.data.signatureLocations = job.data.signatureLocations;
      await signature.save();
      let user = await User.findById({
        _id: data.user,
      });
      mainChannel
        .topic(SERVER_EVENTS_BUS.NEW_SIGNATURE_FOR_DOCUMENT_EVENT)
        .emit({
          accessControl: connection,
          repository,
          document,
          signature,
          users: [user],
        });

      // trigger.sendNotification(
      //   "newSignatureForDocumentEvent",
      //   {
      //     repository,
      //     document,
      //     signature,
      //     users: [user],
      //   },
      //   {
      //     email: true,
      //   }
      // );
      successfullUserIds.push({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
      logger.info(`${data.user} created`);
    }
    while (i < length) {
      let userChunk = job.data.users.slice(i, (i += 20));
      await Promise.all(userChunk.map((user) => _createReview({ user })));
      logger.info(userChunk);
    }
    if (document?.documentData?.conformance <= 0) {
      await DocumentTree.updateOne(
        {
          _id: job?.data?.node,
        },
        {
          "documentData.conformance": 0,
        }
      );
    }
    if (successfullUserIds.length) {
      const totalSignatures = await DocumentSignatures.countDocuments({
        node: job.data?.node,
      });
      const signed = await DocumentSignatures.countDocuments({
        node: job.data?.node,
        status: "Signed",
      });
      const node = await DocumentTree.findOneAndUpdate(
        {
          _id: job.data?.node,
        },
        {
          "documentData.conformance":
            totalSignatures < 1
              ? -1
              : totalSignatures > 0
              ? Math.floor((signed / totalSignatures) * 100)
              : 0,
        },
        {
          new: true,
        }
      );
      mainChannel.topic(SERVER_EVENTS.DOCUMENT_SIGNATURE_REQUESTD).emit({
        accessControl: connection,
        document: node,
        signatureType: "Internal",
        users: successfullUserIds,
        message: job.data.message,
        createdBy: job.data.sender,
      });
      // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_SIGNATURE_REQUESTD, {
      //   accessControl: connection,
      //   document: node,
      //   signatureType: "Internal",
      //   users: successfullUserIds,
      //   message: job.data.message,
      //   createdBy: job.data.sender,
      // });
    }
  } catch (error) {
    logger.info(error);
  }
};
exports.completeAction = async (job) => {
  docsignatureListners({
    message: "Notifications sent for signature",
    data: job.data,
    user: job.data?.sender,
  });
};
