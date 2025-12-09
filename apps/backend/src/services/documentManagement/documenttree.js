const { Manager } = require("./manager");
const mongoose = require("mongoose");
const { TokenStorageService } = require("../tokenManagement");
const Trigger = require("../triggers");
const { sendMail } = require("../../email/sendMail");
const MAX_SUB_FOLDER_DEPTH = 20;
const MAX_SIBLING_ITEMS = 100;
const MAX_DOCUMENT_OWNER = 5;
const { castTo } = require("../../helpers/typeCasting")();
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const _loadash = require("lodash");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { APIError } = require("../../helpers/errors/apiError");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
class DocumentTreeService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async _checkLimitNode(id, insertables = 1) {
    /**
     * we may need to also put repository level restriction
     * to also  bound the root folders.
     */
    if (!id) return;
    /**
     * following equations finds if the future state of a specific tree level
     * exeeds the max sibling limit or not.
     */
    let availableSpace =
      MAX_SIBLING_ITEMS -
      (await this.DocumentTrees.distinct("name", { parentNode: id })).length -
      insertables;
    if (availableSpace < 0)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Maximum sibling folder limit reached"
      );
    const path = await this.generateNodePath(id);
    if (path.length >= MAX_SUB_FOLDER_DEPTH)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Maximum sub folder depth reached"
      );
  }
  async createFolderNode(data) {
    await this._checkLimitNode(data.parentNode);
    let exists = await this.DocumentTrees.findOne({
      organization: this.connection.user.organizationId,
      repository: data.repositoryId,
      parentNode: data.parentNode,
      name: data.name,
      "deleteMarker.status": false,
    });
    if (exists)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Folder already exists"
      );
    const nodeData = {
      modified: { ...data.modified, by: data.modified?.by?._id },
    };
    let node = new this.DocumentTrees({
      organization: this.connection.user.organizationId,
      type: data.type,
      name: data.name,
      repository: data.repositoryId,
      parentNode: data.parentNode,
      folderData: nodeData,
      "created.by": data.modified.by,
    });
    node = await node.save();
    await this.documentCache.clearAll();
    return this.getNode({ _id: node._id });
  }

  async copyRepository(sourceRepoId, targetRepoId) {
    // Find root folders in the source repository
    const sourceNodes = await this.DocumentTrees.find({
      organization: this.connection.user.organizationId,
      repository: sourceRepoId,
      parentNode: null,
      type: "folder",
    });

    if (!sourceNodes.length) {
      return;
    }

    const nodeMapping = new Map();

    const copyFolderNode = async (nodeId, parentTargetId = null) => {
      const node = await this.DocumentTrees.findById(nodeId);
      if (!node || node.type !== "folder") return;

      const nodeData = {
        type: node.type,
        name: node.name,
        repositoryId: new mongoose.Types.ObjectId(targetRepoId),
        parentNode: parentTargetId,
        modified: node.folderData.modified,
      };

      const savedNode = await this.createFolderNode(nodeData);
      nodeMapping.set(node._id.toString(), savedNode._id);

      // Find child folders and copy them recursively
      const childNodes = await this.DocumentTrees.find({
        organization: this.connection.user.organizationId,
        parentNode: node._id,
        repository: sourceRepoId,
        type: "folder",
      });

      for (const child of childNodes) {
        await copyFolderNode(child._id, savedNode._id);
      }
    };

    for (const rootNode of sourceNodes) {
      await copyFolderNode(rootNode?._id);
    }
    await this.documentCache.clearAll();
    return {
      message: "Repository copied successfully.",
      sourceRepoId,
      targetRepoId,
    };
  }

  async addFileNodeVersion(data) {
    let trigger = new Trigger(this.connection);
    if (data.data) {
      await this._checkLimitNode(data.parentNode);
    }
    let nodeName = data.data.storageInfo?.Name;
    let publishedVersion = await this.DocumentTrees.findOne({
      organization: this.connection.user.organizationId,
      repository: data.repositoryId,
      parentNode: data.parentNode,
      name: nodeName,
      status: "Published",
      "deleteMarker.status": false,
    });
    if (!publishedVersion)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No published version found for this document."
      );
    if (publishedVersion.name !== nodeName)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Please upload a copy with same name and file type."
      );
    let nodeData = {
      storageInfo: {
        ...data.data.storageInfo,
        modified: { ...data.modified, by: data.modified?.by?._id },
      },
      applicableModules: publishedVersion?.documentData?.applicableModules,
      complianceTools: publishedVersion?.documentData?.complianceTools,
      purpose: publishedVersion?.documentData?.purpose,
      owners: publishedVersion.documentData.owners,
      authorisation: data.data.authorisation.map((user) => ({
        user: user,
        status: "Pending",
      })),
    };
    /** checking if the file already has a pending approval. */
    let hasPending = await this.DocumentTrees.findOne({
      organization: this.connection.user.organizationId,
      repository: data.repositoryId,
      parentNode: data.parentNode,
      name: nodeName,
      status: "Pending",
      "deleteMarker.status": false,
    });
    if (hasPending)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not add a version now. This document has a pending authorisation."
      );
    /** create the version */
    let node = await this.DocumentTrees.create({
      organization: this.connection.user.organizationId,
      type: data.type,
      name: nodeName,
      repository: data.repositoryId,
      parentNode: data.parentNode,
      ...(nodeData.authorisation.length && { status: "Pending" }),
      documentData: nodeData,
      "created.by": data.modified.by,
    });
    /** populate document node */
    node = await this.DocumentTrees.populateNode(node);
    if (node.status === "Pending") {
      mainChannel
        .topic(SERVER_EVENTS_BUS.NEW_AUTHORISE_FOR_DOCUMENT_EVENT)
        .emit({
          accessControl: this.connection,
          repository: node.repository,
          document: node,
          users: node.documentData.authorisation.map((auth) => auth.user),
        });

      // trigger.sendNotification(
      //   "newAuthoriserForDocumentEvent",
      //   {
      //     repository: node.repository,
      //     document: node,
      //     users: node.documentData.authorisation.map((auth) => auth.user),
      //   },
      //   {
      //     email: true,
      //   }
      // );
      mainChannel.topic(SERVER_EVENTS.DOCUMENT_AUTHORISATION_REQUESTD).emit({
        accessControl: this.connection,
        document: node,
        createdBy: data.modified?.by,
      });
      // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_AUTHORISATION_REQUESTD, {
      //   accessControl: this.connection,
      //   document: node,
      //   createdBy: data.modified?.by,
      // });
    }
    if (node.status === "Published") {
      mainChannel.topic(SERVER_EVENTS.ADDED_NEW_VERSION_OF_DOCUMENT).emit({
        accessControl: this.connection,
        document: node,
        createdBy: data.modified?.by,
      });
      // eventEmitter.emit(SERVER_EVENTS.ADDED_NEW_VERSION_OF_DOCUMENT, {
      //   accessControl: this.connection,
      //   document: node,
      //   createdBy: data.modified?.by,
      // });
    }
    await this.documentCache.clearAll();
    return node;
  }
  async createFileNode(data) {
    let repository = await this.DocumentRepositories.findOne({
      _id: data?.repositoryId,
    });
    if (!repository)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No repository was found : "
      );
    data.data = castTo("array")(data.data);
    if (data.data) {
      await this._checkLimitNode(data.parentNode, data.data.length);
    }
    /** prepare the in insertable format if the files don't have any pending version in review */
    let insertableFormat = await Promise.all(
      data.data.map(async (item) => {
        let nodeName = item.storageInfo?.Name;
        let docOwners = new Set([
          data.modified?.by?._id,
          ...repository?.owners.map((owner) => owner?._id.toString()),
          ...item.owners,
        ]);

        let nodeData = {
          storageInfo: {
            ...item.storageInfo,
            modified: { ...data.modified, by: data.modified?.by?._id },
          },
          applicableModules: item.applicableModules,
          complianceTools: item.complianceTools,
          purpose: item.purpose,
          owners: [...docOwners],
          authorisation: item.authorisation.map((user) => ({
            user: user,
            status: "Pending",
          })),
        };
        /** checking if the file already exists */
        let alreadyExists = await this.DocumentTrees.findOne({
          repository: data.repositoryId,
          parentNode: data.parentNode,
          name: nodeName,
          "deleteMarker.status": false,
        });
        /** if does have a pending review don't return */
        return (
          !alreadyExists && {
            organization: this.connection.user.organizationId,
            type: data.type,
            name: nodeName,
            repository: data.repositoryId,
            parentNode: data.parentNode,
            ...(item.authorisation.length && { status: "Pending" }),
            documentData: nodeData,
            "created.by": data.modified.by,
          }
        );
      })
    );
    /**  only filtering the formats that exists in the array and not undefined or null */
    insertableFormat = insertableFormat.filter((item) => item);
    let nodes = await Promise.all(
      insertableFormat.map((node) => this.DocumentTrees.create(node))
    );
    nodes = await Promise.all(
      nodes.map((node) => this.DocumentTrees.populateNode(node))
    );
    let pendingNodes = nodes.filter((node) => {
      return node.status === "Pending";
    });
    let publishedNodes = nodes.filter((node) => {
      return node.status === "Published";
    });
    pendingNodes.map((node) => {
      mainChannel
        .topic(SERVER_EVENTS_BUS.NEW_AUTHORISE_FOR_DOCUMENT_EVENT)
        .emit({
          accessControl: this.connection,
          repository: node.repository,
          document: node,
          users: node.documentData.authorisation.map((auth) => auth.user),
        });

      // trigger.sendNotification(
      //   "newAuthoriserForDocumentEvent",
      //   {
      //     repository: node.repository,
      //     document: node,
      //     users: node.documentData.authorisation.map((auth) => auth.user),
      //   },
      //   {
      //     email: true,
      //   }
      // );
      mainChannel.topic(SERVER_EVENTS.DOCUMENT_AUTHORISATION_REQUESTD).emit({
        accessControl: this.connection,
        document: node,
        createdBy: data.modified?.by,
      });
      // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_AUTHORISATION_REQUESTD, {
      //   accessControl: this.connection,
      //   document: node,
      //   createdBy: data.modified?.by,
      // });
    });
    publishedNodes.map((node) => {
      mainChannel.topic(SERVER_EVENTS.ADDED_NEW_VERSION_OF_DOCUMENT).emit({
        accessControl: this.connection,
        document: node,
        createdBy: data.modified?.by,
      });
      // eventEmitter.emit(SERVER_EVENTS.ADDED_NEW_VERSION_OF_DOCUMENT, {
      //   accessControl: this.connection,
      //   document: node,
      //   createdBy: data.modified?.by,
      // });
    });
    // eventEmitter.emit(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE, {
    //   accessControl: this.connection,
    //   moduleType: moduleTypes.documenttrees,
    //   user: data.modified.by,
    // });
    mainChannel.topic(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE).emit({
      accessControl: this.connection,
      moduleType: moduleTypes.incidents,
      user: data.createdBy,
    });
    await this.documentCache.clearAll();
    return nodes;
  }
  async listNodeItemsByOrg(query, options) {
    const cacheKey = this.documentCache.createCacheKey({
      orgId: this.connection?.user?.organizationId,
      query,
      options,
    });
    const cachedData = await this.documentCache.get(cacheKey);
    if (cachedData){
      logger.info("Cache hit for listNodeItemsByOrg");
      return cachedData;
    }
    let pagination = await this.DocumentTrees.paginateByOrg(
      this.connection?.user?.organizationId,
      query,
      options
    );
    let nodes = pagination.docs;
    nodes = await Promise.all(
      nodes.map((node) => this.DocumentTrees.populateNode(node))
    );
    const result = { nodes, pagination: this.imsPaginationFormated(pagination) };
    await this.documentCache.set(cacheKey, result);
    logger.info("Cache set for listNodeItemsByOrg");
    return result;
  }
  async listNodesByOrg(queries, options) {
    const cacheKey = this.documentCache.createCacheKey({
      orgId: this.connection?.user?.organizationId,
      query: queries,
      options: options,
    });
    const cachedData = await this.documentCache.get(cacheKey);
    if (cachedData){
      logger.info("Cache hit for listNodesByOrg");
      return cachedData;
    }
    let aggregateQuery = this.DocumentTrees.aggregate();
    aggregateQuery
      .lookup({
        from: "documentrepositories",
        localField: "repository",
        foreignField: "_id",
        as: "_repository",
      })
      .lookup({
        from: "documentrepositories",
        localField: "repository",
        foreignField: "_id",
        as: "_repository",
      })
      .lookup({
        from: "users",
        localField: "created.by",
        foreignField: "_id",
        as: "_createdBy",
      })
      /**
       * we are applying documenttree realted queries in this abject queries.documentMatch
       * this will try to match any property from document trees collection.
       * as _repository object got joined into results from lookup stage, so now we are applying
       * all repository related filters in queries.repositoryMatch. __repository will try to match
       * anything from documentrepositories collection.
       */
      .match({
        /** we are only all allowing undeleted docs, by default */
        "deleteMarker.status": false,
        ...queries.documentMatch,
        /** if no repository matched documets array will be empty */
        _repository: {
          $elemMatch: {
            /** we are only all allowing undeleted repos, by default */
            "deleteMarker.status": false,
            ...queries.repositoryMatch,
            organization: new mongoose.Types.ObjectId(
              this.connection?.user?.organizationId
            ),
          },
        },
      })
      /** prepare data in proper format for population */
      .addFields({
        _createdBy: {
          $arrayElemAt: ["$_createdBy", 0],
        },
      })
      /** populate the aggreagared data in this block, always in index 0 */
      .addFields({
        repository: { $arrayElemAt: ["$_repository", 0] },
        created: {
          by: {
            _id: "$_createdBy._id",
            name: "$_createdBy.name",
          },
          on: "$created.on",
        },
      })
      /** unset the _repository */
      .project({ _repository: 0, _createdBy: 0 });
    let pagination = await this.DocumentTrees.aggregatePaginate(
      aggregateQuery,
      options
    );
    let nodes = pagination.docs;
    const result = { nodes, pagination: this.imsPaginationFormated(pagination) };
    await this.documentCache.set(cacheKey, result);
    logger.info("Cache set for listNodesByOrg");
    return result;
  }
  async generateNodePath(id) {
    let match = {};
    if (id === null || id === "null") match = { _id: null };
    else
      match = {
        _id: new mongoose.Types.ObjectId(id),
        organization: new mongoose.Types.ObjectId(
          this.connection?.user?.organizationId
        ),
      };
    let pathAggregation = await this.DocumentTrees.aggregate([
      { $match: { ...match } },
      {
        $graphLookup: {
          from: "documenttrees",
          startWith: "$parentNode",
          connectFromField: "parentNode",
          connectToField: "_id",
          as: "path",
          depthField: "order",
          maxDepth: 20,
        },
      },
    ]);
    let pathData = pathAggregation[0] ? pathAggregation[0] : null;
    return pathData
      ? [
          ...pathData?.path
            .sort((f_item, s_item) => s_item.order - f_item.order)
            .map((item) => ({
              nodeId: item._id,
              name: item.name,
              order: item.order,
            })),
          {
            nodeId: pathData?._id,
            name: pathData?.name,
          },
        ]
      : [];
  }
  async getPreservedReviewers(id) {
    let reviewers = await this.DocumentSignatures.paginate({ node: id });
    reviewers.docs = reviewers.docs.map((review) => review.user);
    return reviewers;
  }
  async updateFolderNodeMetaData(id, data) {
    let node = await this.getNode({ _id: id });
    if (node.type !== "folder")
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        `${id} ${data.name} is not a folder`
      );
    node = await this.DocumentTrees.findOneAndUpdate(
      { _id: id },
      { $set: { name: data.name, "data.modified": data.modified } },
      { new: true }
    );
    return this.DocumentTrees.populateNode(node);
  }
  async updateDocumentNodeMetaData(id, data) {
    let node = await this.getNode({ _id: id });
    if (node.type !== "document")
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        `${id} ${node.name} is not a document`
      );
    await this.DocumentTrees.updateMany(
      {
        name: node.name,
        repository: node?.repository?._id,
        parentNode: node?.parentNode,
        type: node?.type,
      },
      {
        $set: {
          "documentData.purpose": data.purpose,
          "documentData.applicableModules": data.applicableModules,
          "documentData.complianceTools": data.complianceTools,
          "documentData.owners": data.owners,
        },
      },
      { new: true }
    );
    await this.documentCache.clearAll();
    return this.getNode({ _id: id });
  }
  async getNode(query) {
    let node = await this.DocumentTrees.findOne(query);
    if (!node)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No node was found with query"
      );
    return this.DocumentTrees.populateNode(node);
  }
  async softDeleteNode(id) {
    let node = await this.getNode({ _id: id });
    if (node) {
      const existsInBin = await this.DocumentTrees.findOne({
        type: node.type,
        name: node.name,
        repository: node.repository?._id || node.repository,
        parentNode: node.parentNode || node.parentNode?._id,
        status: "Published",
        "deleteMarker.status": true,
      });
      if (existsInBin)
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          `${node.name} already exist in the bin. Please remove it permanently or restore.`
        );
      await this.DocumentTrees.softDelete({
        type: node.type,
        name: node.name,
        repository: node.repository?._id || node.repository,
        parentNode: node.parentNode || node.parentNode?._id,
      });
      await this.documentCache.clearAll();
      return node;
    }
  }
  async restoreNode(id) {
    let node = await this.getNode({ _id: id });
    if (node) {
      const existsInRepo = await this.DocumentTrees.findOne({
        type: node.type,
        name: node.name,
        repository: node.repository?._id || node.repository,
        parentNode: node.parentNode || node.parentNode?._id,
        status: "Published",
        "deleteMarker.status": false,
      });
      if (existsInRepo)
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          `${node.name} already exist in the directory. Please move the existing document to some other place to restore this document`
        );
      await this.DocumentTrees.restore({
        type: node.type,
        name: node.name,
        repository: node.repository?._id || node.repository,
        parentNode: node.parentNode || node.parentNode?._id,
      });
      await this.documentCache.clearAll();
      return node;
    }
  }
  async hardDeleteNode(id) {
    let node = await this.getNode({ _id: id });
    if (node) {
      this.nodeDeleteQueue.produce({
        accessControl: this.connection,
        nodeIds: [id],
      });
      await this.documentCache.clearAll();
      return node;
    }
  }
  async moveNode(id, parentNode) {
    await this._checkLimitNode(parentNode);
    let node = await this.getNode({ _id: id });
    if (node) {
      let exists = await this.DocumentTrees.findOne({
        organization: this.connection.user.organizationId,
        repository: node.repository?._id || node.repository,
        /** this the parent of place to be moved */
        parentNode,
        name: node.name,
        type: node.type,
      });
      if (exists)
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          `A ${node.type} with the same name already exists.`
        );
      await this.DocumentTrees.updateMany(
        {
          organization: this.connection.user.organizationId,
          name: node.name,
          repository: node.repository?._id || node.repository,
          parentNode: node.parentNode || node.parentNode?._id,
        },
        {
          $set: { parentNode },
        },
        { new: true }
      );
      await this.documentCache.clearAll();
      return this.getNode({ _id: id });
    }
  }
  async changeRepository(id, targetRepository, parentNode) {
    let repository = await this.DocumentRepositories.findOne({
      organization: this.connection.user.organizationId,
      _id: targetRepository,
    });
    if (repository) {
      /** logic not handle prone to bug
       *
       * - what if folder exists in that level in other repository
       */
      let node = await this.moveNode(id, parentNode);
      await this.DocumentTrees.updateMany(
        {
          organization: this.connection.user.organizationId,
          name: node.name,
          repository: node.repository?._id || node.repository,
          parentNode: node.parentNode || node.parentNode?._id,
        },
        {
          $set: { repository: targetRepository },
        },
        { new: true }
      );
      await this.documentCache.clearAll();
      return this.getNode({ _id: id });
    }
  }
  async addRevision(id, data) {
    /** revisions are only allowed for pending auth document nodes */
    let node = await this.getNode({ _id: id });
    if (node) {
      if (node.status !== "Pending")
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "This node is not allowed to have any revision"
        );
      if (data.Name !== node.name)
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "This file is not with same name"
        );
      let revisedNode = await this.DocumentTrees.findOneAndUpdate(
        { _id: id },
        {
          $set: { "documentData.storageInfo": data },
        },
        { new: true }
      );
      revisedNode = await this.DocumentTrees.populateNode(revisedNode);
      await this.fileHandler.deleteFile(node.documentData?.storageInfo);
      let trigger = new Trigger(this.connection);
      // trigger.sendNotification(
      //   "documentRevisionEvent",
      //   {
      //     document: revisedNode,
      //   },
      //   { email: true }
      // );
      mainChannel.topic(SERVER_EVENTS_BUS.DOCUMENT_REVISION_EVENT).emit({
        accessControl: this.connection,
        document: revisedNode,
      });
      mainChannel.topic(SERVER_EVENTS.ADDED_REVISED_DOCUMENT).emit({
        accessControl: this.connection,
        document: revisedNode,
      });
      // eventEmitter.emit(SERVER_EVENTS.ADDED_REVISED_DOCUMENT, {
      //   accessControl: this.connection,
      //   document: revisedNode,
      // });
      await this.documentCache.clearAll();
      return revisedNode;
    }
  }
  async shareDocumentNode(id, data) {
    let node = await this.getNode({ _id: id });
    let tokenStorageService = new TokenStorageService(this.connection);
    if (node) {
      let token = await tokenStorageService.createSecurityAccessToken({
        desciption: "This is used for external access to shared documents",
        token: {
          payload: {
            rid: node?.repository,
            nid: node?._id,
          },
          expiresIn: "2 days",
        },
      });
      let { Bucket, Key, Name } = node.documentData.storageInfo;
      let signedLink = await this.fileHandler.getSingedUrlForView(
        {
          Bucket,
          Key,
          Name,
        },
        { expiresIn: 7 * 24 * 3600 }
      );
      await sendMail("share-document", data.emails, {
        sender: data.sender,
        documentName: node.name,
        viewLink: signedLink,
        customMessage: data.message,
      });
      mainChannel.topic(SERVER_EVENTS.DOCUMENT_SHARED_VIA_EMAIL).emit({
        accessControl: this.connection,
        document: node,
        message: data.message,
        emails: data.emails,
        sender: data.sender,
      });
      // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_SHARED_VIA_EMAIL, {
      //   accessControl: this.connection,
      //   document: node,
      //   message: data.message,
      //   emails: data.emails,
      //   sender: data.sender,
      // });
    }
    await this.documentCache.clearAll();
    return node;
  }
  async countNodes(query) {
    return this.DocumentTrees.countDocuments({
      ...query,
      organization: this.connection.user.organizationId,
    });
  }
  async calculateAndUpdateConformance(id) {
    const totalSignatures = await this.DocumentSignatures.countDocuments({
      node: id,
      // organization: this.connection.user.organizationId, // not necessary here
    });
    const signed = await this.DocumentSignatures.countDocuments({
      node: id,
      status: "Signed",
      // organization: this.connection.user.organizationId, // not necessary here
    });
    await this.DocumentTrees.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          "documentData.conformance":
            totalSignatures < 1
              ? -1
              : totalSignatures > 0
              ? Math.floor((signed / totalSignatures) * 100)
              : 0,
        },
      }
    );
    if (Math.floor((signed / totalSignatures) * 100) === 100) {
      const document = await this.getNode({ _id: id });
      const trigger = new Trigger(this.connection);
      mainChannel
        .topic(SERVER_EVENTS_BUS.DOCUMENT_FULL_CONFORMANCE_EVENT)
        .emit({
          accessControl: this.connection,
          document,
        });

      // trigger.sendNotification(
      //   "documentFullConformanceEvent",
      //   { document },
      //   { email: true }
      // );
      mainChannel.topic(SERVER_EVENTS.DOCUMENT_CONFORMANCE_MILESTONE).emit({
        accessControl: this.connection,
        document,
      });
      // eventEmitter.emit(SERVER_EVENTS.DOCUMENT_CONFORMANCE_MILESTONE, {
      //   accessControl: this.connection,
      //   document,
      // });
    }
  }
}
exports.DocumentTreeService = DocumentTreeService;
