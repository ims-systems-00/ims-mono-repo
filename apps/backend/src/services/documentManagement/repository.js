const { APIError } = require("../../helpers/errors/apiError");
const { Manager } = require("./manager");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { DocumentTreeService } = require("./documenttree");
class DocumentRepositoryService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createRepository(data, config = {}) {
    let repository = await this.DocumentRepositories.create({
      organization: this.connection.user.organizationId,
      name: data.name,
      description: data.description,
      privacy: data.privacy,
      group: data.group,
      owners: [...new Set([data.createdBy, ...data.owners])],
      sharedWith: data.sharedWith,
      classification: data.classification,
      purpose: data.purpose,
      reviewInterval: data.reviewInterval,
      authorisation: data.authorisation,
      signature: data.signature,
      created: {
        by: data.createdBy,
        on: Date.now(),
      },
    });
    repository = await this.DocumentRepositories.populateRepository(repository);
    const documentTreeService = new DocumentTreeService(this.connection);
    // If a sourceRepoId is provided, copy its structure to the new repository
    if (config?.sourceRepoId) {
      await documentTreeService.copyRepository(
        config.sourceRepoId,
        repository._id
      );
    }

    mainChannel.topic(SERVER_EVENTS_BUS.NEW_REPOSITORY_OWNER_EVENT).emit({
      accessControl: this.connection,
      repository,
    });

    mainChannel.topic(SERVER_EVENTS_BUS.SHARE_REPOSITORY_EVENT).emit({
      accessControl: this.connection,
      repository,
      users: repository.sharedWith,
    });
    // this.trigger.sendNotification("newRepositoryOwnerEvent", repository);
    return repository;
  }
  async getRepositories(query, options) {
    let repositories = [];
    const pagination = await this.DocumentRepositories.paginate(query, options);
    repositories = pagination.docs;
    repositories = await Promise.all(
      repositories.map((repository) =>
        this.DocumentRepositories.populateRepository(repository)
      )
    );
    return {
      repositories,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getRepositoriesByOrg(query, options) {
    let repositories = [];
    const pagination = await this.DocumentRepositories.paginateByOrg(
      this.connection?.user?.organizationId,
      query,
      options
    );
    repositories = pagination.docs;
    repositories = await Promise.all(
      repositories.map((repository) =>
        this.DocumentRepositories.populateRepository(repository)
      )
    );
    return {
      repositories,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async updateRepository(id, data) {
    let repository = await this.getRepository({ _id: id });
    if (repository) {
      let oldOwners = repository?.owners?.map((o) => o._id.toString());
      let deleteOwners = oldOwners.filter((o) => !data.owners.includes(o));
      let newOwners = data.owners.filter((o) => !oldOwners.includes(o));
      let updatedRepository = await this.DocumentRepositories.findOneAndUpdate(
        { _id: id },
        {
          name: data.name,
          description: data.description,
          privacy: data.privacy,
          group: data.group,
          owners: [...new Set([data.createdBy, ...data.owners])],
          sharedWith: data.sharedWith,
          classification: data.classification,
          purpose: data.purpose,
          reviewInterval: data.reviewInterval,
          authorisation: data.authorisation,
          signature: data.signature,
        },
        { new: true }
      );
      if (deleteOwners?.length) {
        logger.info("deleting old owners from the tree...");
        await this.DocumentTrees.updateMany(
          { repository: id, type: "document" },
          {
            $pullAll: { "documentData.owners": deleteOwners },
          }
        );
      }
      if (newOwners?.length) {
        logger.info("adding new owners to the tree...");
        await this.DocumentTrees.updateMany(
          { repository: id, type: "document" },
          {
            $addToSet: {
              "documentData.owners": newOwners,
            },
          }
        );
      }
      updatedRepository = await this.DocumentRepositories.populateRepository(
        updatedRepository
      );
      // this.trigger.sendNotification("shareRepositoryEvent", {
      //   repository: updatedRepository,
      //   users: updatedRepository?.sharedWith?.filter(
      //     (user) => !repository?.sharedWith?.includes(user._id)
      //   ),
      // });

      mainChannel.topic(SERVER_EVENTS_BUS.SHARE_REPOSITORY_EVENT).emit({
        accessControl: this.connection,
        repository: updatedRepository,
        users: updatedRepository?.sharedWith?.filter(
          (user) => !repository?.sharedWith?.includes(user._id)
        ),
      });

      if (
        updatedRepository.owners.some(
          (owner) =>
            !repository.owners.map((o) => o._id).includes(owner._id?.toString())
        )
      )
        mainChannel.topic(SERVER_EVENTS_BUS.NEW_REPOSITORY_OWNER_EVENT).emit({
          accessControl: this.connection,
          repository: updatedRepository,
        });
      // this.trigger.sendNotification(
      //   "newRepositoryOwnerEvent",
      //   updatedRepository
      // );
      return updatedRepository;
    }
  }
  async getRepository(query) {
    let repository = await this.DocumentRepositories.findOne(query);
    if (!repository)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No repository was found : "
      );
    return this.DocumentRepositories.populateRepository(repository);
  }
  async _canDeleteRepository(id) {
    let foundProject = await this.ImsPorjects.findOne({ repository: id });
    if (foundProject)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        `Can not delete, the repository is linked to: ${foundProject.reference} - ${foundProject.title}`
      );
    return true;
  }
  async softDeleteRepository(id) {
    if (await this._canDeleteRepository(id)) {
      let repository = await this.getRepository({ _id: id });
      if (repository) {
        await this.DocumentRepositories.softDelete({ _id: id });
        return repository;
      }
    }
  }
  async hardDeleteRepository(id) {
    if (await this._canDeleteRepository(id)) {
      let repository = await this.getRepository({ _id: id });
      if (repository) {
        this.repoDeleteQueue.produce({
          accessControl: this.connection,
          id,
        });
      }
      return repository;
    }
  }
  async restoreRepository(id) {
    let repository = await this.getRepository({ _id: id });
    if (repository) {
      await this.DocumentRepositories.restore({ _id: id });
      return repository;
    }
  }
}
exports.DocumentRepositoryService = DocumentRepositoryService;
