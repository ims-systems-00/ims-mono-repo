const { models } = require("../../models");
const addInternalSignaturesQueue = require("./queue/addInternalSignatures.queue");
const addExternalSignaturesQueue = require("./queue/addExternalSignatures.queue");
const resendInternalSignaturesQueue = require("./queue/resendInternalSignatures.queue");
const resendExternalSignaturesQueue = require("./queue/resendExternalSignatures.queue");

const { FileManager } = require("../../helpers/fileManager");
const Trigger = require("../../services/triggers");
const { imsPaginationFormated } = require("../utility");
const nodeDeleteQueue = require("./queue/nodeDelete.queue");
const repoDeleteQueue = require("./queue/repoDelete.queue");
const CacheControl = require("../../cache/cacheControll");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.DocumentRepositories = models.documentrepositories(connection);
    this.DocumentTrees = models.documenttrees(connection);
    this.DocumentSignatures = models.documentsignatures(connection);
    this.ImsPorjects = models.imsProjects(connection);
    this.trigger = new Trigger(connection);
    this.documentCache = new CacheControl({
      cacheClient: 'redis',
      prefix: 'documentTree',
      expireInSeconds: 600
    })
    this.imsPaginationFormated = imsPaginationFormated;
    this.addInternalSignaturesQueue = addInternalSignaturesQueue;
    this.addExternalSignaturesQueue = addExternalSignaturesQueue;
    this.resendInternalSignaturesQueue = resendInternalSignaturesQueue;
    this.resendExternalSignaturesQueue = resendExternalSignaturesQueue;

    this.fileHandler = new FileManager(connection);
    this.nodeDeleteQueue = nodeDeleteQueue;
    this.repoDeleteQueue = repoDeleteQueue;
  }
}
exports.Manager = Manager;
