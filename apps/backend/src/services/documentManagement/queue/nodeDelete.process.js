const { models } = require("../../../models");
const { FileManager } = require("../../../helpers/fileManager");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
exports.consume = async (job) => {
  let connection = job.data?.accessControl;
  let DocumentTree = models.documenttrees(connection);
  let fileHandler = new FileManager(connection);
  async function _delete(node) {
    await DocumentTree.deleteOne({ _id: node._id });
    if (node.type === "document")
      try {
        await fileHandler.deleteFile(node.documentData?.storageInfo);
      } catch (err) {
        logger.error("error remoming file from s3: ", err);
      }
  }
  async function _deleteNodeRecursive(id) {
    /** following block retrives all the children recursively */
    let nodeVisits = [id];
    let childVisits = 0;
    let nodeIndex = 0;
    while (nodeVisits[nodeIndex]) {
      let node = await DocumentTree.findById(nodeVisits[nodeIndex]);
      if (node) {
        childVisits = await DocumentTree.find({
          parentNode: node._id,
        });
        if (childVisits.length)
          nodeVisits.push(...childVisits.map((child) => child._id?.toString()));
        /** delete current visiting node and all the files from storage */
        await _delete(node);
        logger.info("deleted", {
          _id: node._id,
          name: node.name,
          type: node.type,
        });
        nodeIndex++;
      }
    }
  }
  async function _deleteDocumentNode(id) {
    let node = await DocumentTree.findById(id);
    if (node) {
      if (node.status === "Published") {
        let versions = await DocumentTree.find({
          name: node.name,
          parentNode: node.parentNode,
          "deleteMarker.status": true,
        });
        logger.info("versions found", { length: versions.length });
        for (let version of versions) {
          await _delete(version);
          logger.info("version deleted", {
            _id: version._id,
            name: version.name,
            dvID: version.documentData?.dvID,
          });
        }
      } else {
        await _delete(node);
      }
      logger.info("deleted", {
        _id: node._id,
        name: node.name,
        type: node.type,
      });
    }
  }
  try {
    for (let nodeId of job.data.nodeIds) {
      let node = await DocumentTree.findById(nodeId);
      if (node && node.type === "document") await _deleteDocumentNode(nodeId);
      else await _deleteNodeRecursive(nodeId);
    }
  } catch (err) {
    logger.info(err);
  }
};
exports.completeAction = async (job) => {};
