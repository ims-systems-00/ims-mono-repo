const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { models } = require("../../../models");
const nodeDeleteQueue = require("./nodeDelete.queue");
exports.consume = async (job) => {
  let connection = job.data?.accessControl;
  let DocumentRepositories = models.documentrepositories(connection);
  let DocumentTrees = models.documenttrees(connection);
  try {
    let nextPage = 1;
    while (nextPage) {
      let pagination = await DocumentTrees.paginate(
        {
          respositoryy: job.data.id,
          parentNode: null,
        },
        {
          page: nextPage,
          limit: 3,
        }
      );
      let nodes = pagination.docs;
      logger.info(`Chunck ${nextPage}`, nodes.length);
      logger.info("Preparing child node deletes for chunk :", nextPage);
      nodeDeleteQueue.produce({
        accessControl: connection,
        nodeIds: nodes.map((node) => node._id),
      });
      nextPage = pagination.nextPage;
    }
    await DocumentRepositories.deleteOne({ _id: job.data.id });
  } catch (err) {
    logger.info(err);
  }
};
exports.completeAction = async (job) => {};
