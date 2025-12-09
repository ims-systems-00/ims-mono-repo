const { Manager } = require("./manager");
const { Token } = require("../tokenManagement");
const { FileManager } = require("../../helpers/fileManager");
const { fork } = require("child_process");
const { DocumentTreeService } = require("./documenttree");
const {
  attachSignature,
} = require("@ims-systems-00/ims-core/lib/filemodifier");
const Trigger = require("../../services/triggers");
const path = require("path");
const { sendMail } = require("../../email/sendMail");
const fs = require("fs");
const { SERVER_EVENTS } = require("../../events/constants");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

class DocumentSignatureService extends Manager {
  constructor(connection) {
    super(connection);
    this.documentTreeService = new DocumentTreeService(connection);
  }
  // Helper method to validate signature locations
  validateSignatureLocations(locations) {
    if (!Array.isArray(locations) || locations.length === 0) {
      return false;
    }

    return locations.every(
      (location) =>
        typeof location.startX === "number" &&
        typeof location.startY === "number" &&
        typeof location.pageNumber === "number" &&
        location.startX >= 0 &&
        location.startX <= 1 &&
        location.startY >= 0 &&
        location.startY <= 1 &&
        location.pageNumber >= 1
    );
  }

  async addInternalUsersForSignatre(data) {
    if (!this.validateSignatureLocations(data.signatureLocations)) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid signature locations"
      );
    }
    this.addInternalSignaturesQueue.produce({
      accessControl: this.connection,
      repository: data.repository,
      node: data.node,
      users: data.users,
      message: data.message,
      sender: data.requestedBy,
      signatureLocations: data.signatureLocations,
    });
  }

  async addExternalUsersForSignatre(data) {
    if (!this.validateSignatureLocations(data.signatureLocations)) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid signature locations"
      );
    }
    this.addExternalSignaturesQueue.produce({
      accessControl: this.connection,
      repository: data.repository,
      node: data.node,
      emails: data.emails,
      sender: data.requestedBy,
      message: data.message,
      signatureLocations: data.signatureLocations,
    });
  }

  async getSignaturesByOrg(query, options) {
    let pagination = await this.DocumentSignatures.paginateByOrg(
      this.connection?.user?.organizationId ||
        this.connection?.externalID?.organizationId,
      query,
      options
    );
    let usersForSignature = pagination.docs;
    usersForSignature = await Promise.all(
      usersForSignature.map((user) =>
        this.DocumentSignatures.populateDocumentReview(user)
      )
    );
    return {
      usersForSignature,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getSignature(query) {
    let userSignature = await this.DocumentSignatures.findOne(query);

    if (!userSignature)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No signature found for this user with supplied query"
      );
    return this.DocumentSignatures.populateDocumentReview(userSignature);
  }
  async handleSignature(signature_id, data) {
    let fileManager = new FileManager(this.connection);
    let userSignature = await this.getSignature({ _id: signature_id });
    let documentNode = await this.documentTreeService.getNode({
      _id: userSignature.node,
    });
    let process = fork(
      path.resolve(__dirname + "/../../subprocess/fileConverter.js")
    );
    let { Bucket, Key, Version } = documentNode.documentData.storageInfo;
    process.send({ Bucket, Key, Version, accessControl: this.connection });
    process.on("message", async (message) => {
      let file = message?.result?.originalResponse;
      let preparedFile = message?.result?.preparationResponse;
      try {
        let trigger = new Trigger(this.connection);

        // Apply signature to all selected locations
        const signatureLocations = userSignature.data.signatureLocations;

        // Apply signature to each location sequentially
        // Note: Each attachSignature call modifies the same file, which is correct
        // as we want all signatures to appear on the final document
        for (const location of signatureLocations) {
          try {
            await attachSignature({
              filePath: preparedFile.path,
              name: data.name,
              signature: data.signature,
              signatureFont: data.font,
              jobTile: data.jobTitle,
              organisation: data.organisation,
              startX: location.startX,
              startY: location.startY,
              pageNumber: location.pageNumber,
            });
            logger.info(
              `Signature applied to location: page ${location.pageNumber}, x: ${location.startX}, y: ${location.startY}`
            );
          } catch (signatureError) {
            logger.error(
              `Failed to apply signature to location: page ${location.pageNumber}, x: ${location.startX}, y: ${location.startY}`,
              signatureError
            );
            // Continue with other locations even if one fails
          }
        }
        mainChannel.topic(SERVER_EVENTS_BUS.DOCUMENT_SIGNED_EVENT).emit({
          accessControl: this.connection,
          document: documentNode,
          person: data.name,
        });

        // trigger.sendNotification(
        //   "documentSignedEvent",
        //   {
        //     document: documentNode,
        //     person: data.name,
        //   },
        //   {
        //     email: true,
        //   }
        // );
        let pdfDocSplited = documentNode.name.split(".");
        let pdfDocName = `${pdfDocSplited
          .slice(0, pdfDocSplited.length - 1)
          .join("")}.pdf`;
        if (userSignature?.user?.externalEmail)
          await sendMail(
            "send-signed-copy-to-signee",
            userSignature.user.externalEmail,
            {
              name: data.name,
              documentName: pdfDocName,
              attachments: [
                {
                  filename: pdfDocName,
                  path: preparedFile.path,
                },
              ],
            }
          );
        let filesToBeDeleted = [file, preparedFile];
        let fileStream = fs.createReadStream(preparedFile.path);
        let s3Resposnse = await fileManager.storeInS3(
          Bucket,
          { name: preparedFile.fileName, data: fileStream },
          "/general"
        );
        const signedCopyInfo = {
          Name: pdfDocName,
          Key: s3Resposnse?.Key,
          key: s3Resposnse?.Key,
          Bucket: s3Resposnse?.Bucket,
        };
        await this.DocumentSignatures.updateOne(
          {
            _id: signature_id,
          },
          {
            $set: {
              status: data.status,
              "data.signedCopy": signedCopyInfo,
              signedAt: Date.now(),
            },
          }
        );
        await this.documentTreeService.calculateAndUpdateConformance(
          documentNode?._id
        );
        await Promise.all(
          filesToBeDeleted.map((file) => fileManager.removeTemporary(file))
        );
      } catch (err) {
        logger.info(err.message, err);
      }
      process.kill(message?.pid);
      process.kill("SIGINT");
    });
    userSignature = await this.DocumentSignatures.findOneAndUpdate(
      {
        _id: signature_id,
      },
      {
        $set: {
          status: data.status,
          "data.signature": data.signature,
          "data.font": data.font,
          "data.name": data.name,
          "data.organisation": data.organisation,
          "data.jobTitle": data.jobTitle,
          // Update signature locations if provided
          ...(data.signatureLocations && {
            "data.signatureLocations": data.signatureLocations,
          }),
          securityToken: null,
          signedAt: Date.now(),
        },
      },
      { new: true }
    );
    mainChannel.topic(SERVER_EVENTS.DOCUMENT_SIGNED).emit({
      accessControl: this.connection,
      document: documentNode,
      signee: data.name,
    });
    // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_SIGNED, {
    //   accessControl: this.connection,
    //   document: documentNode,
    //   signee: data.name,
    // });
    return userSignature;
  }
  async removeUsersForSignature(query) {
    const signature = await this.getSignature(query);
    const signatures = await this.DocumentSignatures.deleteMany({
      ...query,
      organization: this.connection?.user?.organizationId,
    });
    if (signature) {
      await this.documentTreeService.calculateAndUpdateConformance(
        signature?.node
      );
    }
    return signatures;
  }
  async authSignaturePermissision(token) {
    if (!token)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No token provided"
      );
    let { expired, decoded } = await Token.verify(token, process.env.JWT_KEY);
    if (expired)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Token expired"
      );
    return decoded;
  }
  async resendExternalSignature(data) {
    this.resendExternalSignaturesQueue.produce({
      signatureIds: data.signatureIds,
      accessControl: this.connection,
      sender: data.requestedBy,
    });
  }
  async resendInternalSignature(data) {
    this.resendInternalSignaturesQueue.produce({
      signatureIds: data.signatureIds,
      accessControl: this.connection,
      sender: data.requestedBy,
    });
  }
}
exports.DocumentSignatureService = DocumentSignatureService;
