const { models } = require("../../../models");
const { TokenStorageService } = require("../../tokenManagement");
const { sendMail } = require("../../../email/sendMail");
const { SERVER_EVENTS } = require("../../../events/constants");
const docsignatureListners = require("../../../socket/listeners/documentSignature.listener");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { mainChannel } = require("../../../eventsV2/topic");
const eventEmitter = require("../../../events/event-manager").getInstance();
exports.consume = async (job) => {
  let connection = job.data?.accessControl;
  let DocumentRepository = models.documentrepositories(connection);
  let DocumentSignatures = models.documentsignatures(connection);
  let DocumentTree = models.documenttrees(connection);
  let tokenManagementService = new TokenStorageService(connection);
  let i = 0;
  let length = job.data?.emails?.length;
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
    /**
     * create a review for a user...
     */
    async function _createReview(data) {
      let review = await DocumentSignatures.findOne({
        repository: job?.data?.repository,
        node: job?.data?.node,
        "user.externalEmail": data?.email,
        type: "External",
      });
      if (review) {
        logger.info(`${data?.email} already exists`);
        return;
      }
      let signature = new DocumentSignatures({
        organization: connection.user.organizationId,
        type: "External",
        message: job?.data?.message,
        repository: job.data?.repository,
        node: job.data?.node,
        user: {
          externalEmail: data?.email,
        },
      });
      let securityToken =
        await tokenManagementService.createSecurityAccessToken({
          organization: connection.user.organizationId,
          desciption: "This is used for external access",
          token: {
            payload: {
              rid: job.data?.repository,
              nid: job.data?.node,
              sid: signature._id,
              organizationId: connection.user.organizationId,
              email: data.email,
            },
            expiresIn: "7 days",
          },
        });
      signature.securityToken = securityToken._id;

      // Set signature locations
      signature.data.signatureLocations = job.data.signatureLocations;
      await signature.save();
      successfullUserIds.push(data.email);
      await sendMail("ask-for-document-signature", data.email, {
        name: "",
        sender: job.data.sender,
        documentName: document.name,
        customMessage: job.data.message,
        signatureLink:
          process.env.CLIENT_URL +
          `/public/document-repositories/${job?.data?.repository}/nodes/${job?.data?.node}` +
          "?" +
          `lat=${securityToken.value}&cid=${securityToken._id}&organization=${connection.user.organizationId}`,
      });
      logger.info(`${data.email} created`);
    }
    while (i < length) {
      let emailChunk = job.data.emails.slice(i, (i += 20));
      await Promise.all(emailChunk.map((email) => _createReview({ email })));
      logger.info(emailChunk);
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
        emails: job.data.emails,
        message: job.data.message,
        signatureType: "External",
        createdBy: job.data.sender,
      });
      // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_SIGNATURE_REQUESTD, {
      //   accessControl: connection,
      //   document: node,
      //   emails: job.data.emails,
      //   message: job.data.message,
      //   signatureType: "External",
      //   createdBy: job.data.sender,
      // });
    }
  } catch (error) {
    logger.info(error);
  }
};
exports.completeAction = async (job) => {
  docsignatureListners({
    message: "Emails sent for signature",
    data: job.data,
    user: job.data?.sender,
  });
};
