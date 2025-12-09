const { models } = require("../../../models");
const { TokenStorageService } = require("../../tokenManagement");
const { sendMail } = require("../../../email/sendMail");
const { SERVER_EVENTS } = require("../../../events/constants");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { mainChannel } = require("../../../eventsV2/topic");
const eventEmitter = require("../../../events/event-manager").getInstance();
exports.consume = async (job) => {
  let connection = job.data?.accessControl;
  let DocumentSignatures = models.documentsignatures(connection);
  let DocumentTree = models.documenttrees(connection);
  let tokenManagementService = new TokenStorageService(connection);
  let length = job.data?.signatureIds?.length;
  try {
    /**
     * resend a review for a user...
     */
    async function _resend(id) {
      let review = await DocumentSignatures.findOne({
        _id: id,
      });
      if (review) {
        let document = await DocumentTree.findOne({ _id: review?.node });
        let securityToken =
          await tokenManagementService.createSecurityAccessToken({
            organization: connection.user.organizationId,
            desciption: "This is used for external access",
            token: {
              payload: {
                rid: review?.repository,
                nid: review?.node,
                organizationId: connection.user.organizationId,
                sid: review._id,
                email: review.user.externalEmail,
              },
              expiresIn: "7 days",
            },
          });
        review.securityToken = securityToken._id;
        await review.save();
        await sendMail(
          "ask-for-document-signature",
          review.user.externalEmail,
          {
            name: "",
            sender: job.data?.sender,
            documentName: document.name,
            customMessage: review?.message,
            signatureLink:
              process.env.CLIENT_URL +
              `/public/document-repositories/${review?.repository}/nodes/${review?.node}` +
              "?" +
              `lat=${securityToken.value}&cid=${securityToken._id}&organization=${connection.user.organizationId}`,
          }
        );
        mainChannel.topic(SERVER_EVENTS.DOCUMENT_SIGNATURE_REQUESTD).emit({
          accessControl: connection,
          document,
          emails: [review.user.externalEmail],
          message: review?.message,
          signatureType: "External",
          createdBy: job.data.sender,
        });
        // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_SIGNATURE_REQUESTD, {
        //   accessControl: connection,
        //   document,
        //   emails: [review.user.externalEmail],
        //   message: review?.message,
        //   signatureType: "External",
        //   createdBy: job.data.sender,
        // });
        logger.info(`${review.user.externalEmail} created`);
      }
    }
    for (let i = 0; i < length; i++) {
      await _resend(job.data?.signatureIds[i]);
    }
  } catch (error) {
    logger.info(error);
  }
};
exports.completeAction = async (job) => {};
