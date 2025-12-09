const { DocumentTreeService } = require("./documenttree");
const eventEmitter = require("../../events/event-manager").getInstance();
const { SERVER_EVENTS } = require("../../events/constants");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

class DocumentAuthFlowService extends DocumentTreeService {
  constructor(connection) {
    super(connection);
  }
  async addAuthoriser(node_id, data) {
    let node = await this.getNode({ _id: node_id, status: "Pending" });
    if (node) {
      node = await this.DocumentTrees.findOneAndUpdate(
        {
          _id: node_id,
        },
        {
          $push: {
            "documentData.authorisation": {
              user: data.user,
              status: "Pending",
            },
          },
        },
        { new: true }
      );
    }
    return this.getNode({ _id: node._id });
  }
  async handleAuthorisation(node_id, authorisation_id, data) {
    let node = await this.getNode({ _id: node_id });
    if (node) {
      const publishedby = await node?.created?.by;
      node = await this.DocumentTrees.findOneAndUpdate(
        {
          "documentData.authorisation._id": authorisation_id,
        },
        {
          $set: { "documentData.authorisation.$.status": data.status },
        },
        {
          new: true,
        }
      );
      if (!node) throw new Error("There's no such pending authorisation.");
      node = await this.getNode({ _id: node_id });
      const handledAuthorisation = node?.documentData?.authorisation?.find(
        (auth) => auth?._id.toString() === authorisation_id.toString()
      );
      // this.trigger.sendNotification(
      //   "documentAuthorisedEvent",
      //   {
      //     handledAuthorisation,
      //     document: node,
      //   },
      //   { email: true }
      // );
      mainChannel.topic(SERVER_EVENTS_BUS.DOCUMENT_AUTHORISE_EVENT).emit({
        accessControl: this.connection,
        handledAuthorisation,
        document: node,
      });
      mainChannel.topic(SERVER_EVENTS.DOCUMENT_AUTH_REVIEWED).emit({
        accessControl: this.connection,
        document: node,
        message: data.message,
        authorisation: handledAuthorisation,
      });
      // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_AUTH_REVIEWED, {
      //   accessControl: this.connection,
      //   document: node,
      //   message: data.message,
      //   authorisation: handledAuthorisation,
      // });
      /**
       * The following block publishes a document if all the authorisers have authorised
       * a document, only applicable to authorisation type review.
       */
      if (data.status === "Rejected") {
        node = await this.DocumentTrees.findOne({
          _id: node_id,
        });
        node.status = "Rejected";
        await node.save();
        logger.info("Document rejected", node);
      } else {
        let pendingReview = await node.documentData.authorisation.find(
          (auth) => auth.status === "Pending"
        );
        if (!pendingReview) {
          node = await this.DocumentTrees.findOne({
            _id: node_id,
          });
          node.status = "Published";
          node = await node.save();
          mainChannel.topic(SERVER_EVENTS.ADDED_NEW_VERSION_OF_DOCUMENT).emit({
            accessControl: this.connection,
            document: node,
            createdBy: publishedby,
          });
          // eventEmitter.emit(SERVER_EVENTS.ADDED_NEW_VERSION_OF_DOCUMENT, {
          //   accessControl: this.connection,
          //   document: node,
          //   createdBy: publishedby,
          // });
          logger.info("Document publised", node);
        }
      }
    }
    return this.getNode({ _id: node._id });
  }
  async removeAuthoriser(node_id, auhtorisation_id) {
    let node = await this.getNode({ _id: node_id, status: "Pending" });
    if (node) {
      node = await this.DocumentTrees.findOneAndUpdate(
        {
          _id: node_id,
        },
        {
          $pull: {
            "documentData.authorisation": {
              _id: auhtorisation_id,
            },
          },
        },
        { new: true }
      );
    }
    return node;
  }
}
exports.DocumentAuthFlowService = DocumentAuthFlowService;
