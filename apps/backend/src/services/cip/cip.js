const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { APIError } = require("../../helpers/errors/apiError");
const { basicRoleScopedFilter } = require("../../queries");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

class CipCRUDOperations extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createCip(data) {
    let {
      title,
      owner,
      attachments,
      group,
      opportunityForImprovement,
      cost,
      createdBy,
      moduleType,
      module,
    } = data;
    let cip = new this.Cips({
      organization: this.connection.user.organizationId,
      title,
      group,
      owner,
      cost,
      opportunityForImprovement,
      source: {
        moduleType: moduleType || "",
        module: module || null,
      },
      attachments: attachments ? attachments : [],
      created: {
        by: createdBy?._id,
        on: Date.now(),
      },
    });
    await cip.save();
    cip = await this.Cips.populateCip(cip);
    // this.trigger.sendNotification("newOfiOwnerEvent", cip);
    mainChannel.topic(SERVER_EVENTS_BUS.NEW_OFI_OWNER_EVENT).emit({
      accessControl: this.connection,
      cip,
    });
    mainChannel.topic(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE).emit({
      accessControl: this.connection,
      moduleType: moduleTypes.cips,
      user: createdBy,
    });
    mainChannel.topic(SERVER_EVENTS.OFI_CREATED).emit({
      accessControl: this.connection,
      cip,
    });
    // eventEmitter.emit(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE, {
    //   accessControl: this.connection,
    //   moduleType: moduleTypes.cips,
    //   user: createdBy,
    // });

    // eventEmitter.emit(SERVER_EVENTS.OFI_CREATED, {
    //   accessControl: this.connection,
    //   cip,
    // });
    await this.cipCache.clearAll();
    return cip;
  }
  async updateCip(id, data) {
    let { title, owner, cost, attachments, opportunityForImprovement } = data;
    let prevCip = await this.getCip({ _id: id });
    if (this._isImplemented(prevCip))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not update implemented OFI."
      );
    const mutations = { ...data };
    delete mutations["attachments"];
    let cip = await this.Cips.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...mutations,
        },
        $push: { attachments: attachments ? attachments : [] },
      },
      { new: true }
    );
    cip = await this.Cips.populateCip(cip);
    if (prevCip.owner?._id.toString() !== owner.toString()) {
      // this.trigger.sendNotification("newOfiOwnerEvent", cip, { email: true });
      mainChannel.topic(SERVER_EVENTS_BUS.NEW_OFI_OWNER_EVENT).emit({
        accessControl: this.connection,
        cip,
      });
      mainChannel.topic(SERVER_EVENTS.OFI_OWNERSHIP_CHANGED).emit({
        accessControl: this.connection,
        cip,
        prevCip,
        user: data.updatedBy,
      });

      // eventEmitter.emit(SERVER_EVENTS.OFI_OWNERSHIP_CHANGED, {
      //   accessControl: this.connection,
      //   cip,
      //   prevCip,
      //   user: data.updatedBy,
      // });
    }
    if (data.attachments?.length) {
      mainChannel.topic(SERVER_EVENTS.ATTACHMENT_ADDED).emit({
        accessControl: this.connection,
        moduleType: moduleTypes.cips,
        module: cip,
        user: data.updatedBy,
        attachments: data.attachments,
      });
      // eventEmitter.emit(SERVER_EVENTS.ATTACHMENT_ADDED, {
      //   accessControl: this.connection,
      //   moduleType: moduleTypes.cips,
      //   module: cip,
      //   user: data.updatedBy,
      //   attachments: data.attachments,
      // });
    }
    await this.cipCache.clearAll();
    return cip;
  }
  async listCips(query, options) {
    const cacheKey = this.cipCache.createCacheKey({
      userId: this.connection?.user?._id,
      query,
      options,
    });
    const cachedData = await this.cipCache.get(cacheKey);
    if (cachedData) {
      logger.info("cache hit for listCips", {cacheKey});
      return cachedData;
    }
    let pagination = await this.Cips.paginate(query, options);
    let cips = pagination.docs;
    cips = await Promise.all(cips.map((cip) => this.Cips.populateCip(cip)));
    await this.cipCache.set(cacheKey, { cips, pagination });
    logger.info("cache set for listCips", {cacheKey});
    return { cips, pagination: this.imsPaginationFormated(pagination) };
  }
  async listCipsByOrg(query, options) {
    const cacheKey = this.cipCache.createCacheKey({
      orgId: this.connection?.user?.organizationId,
      query,
      options,
    });
    const cachedData = await this.cipCache.get(cacheKey);
    if (cachedData) {
      logger.info("cache hit for listCipsByOrg", {cacheKey});
      return cachedData;
    }
    let pagination = await this.Cips.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let cips = pagination.docs;
    cips = await Promise.all(cips.map((cip) => this.Cips.populateCip(cip)));
    const result = { cips, pagination: this.imsPaginationFormated(pagination) };
    await this.cipCache.set(cacheKey, result);
    logger.info("cache set for listCipsByOrg", {cacheKey});
    return result;
  }
  async getCip(query) {
    let cip = await this.Cips.findOne(query);
    if (!cip)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No cip was found with the query."
      );
    return this.Cips.populateCip(cip);
  }
  async deleteCip(id) {
    let cip = await this.getCip({ _id: id });
    await this.Cips.deleteOne({ _id: id });
    await this.cipCache.clearAll();
    return cip;
  }
  async deleteAttachment(id, data) {
    let cip = await this.Cips({ _id: id });
    cip = await this.Cips.findOneAndUpdate(
      { _id: id },
      {
        $pull: { attachments: { _id: data.attachment_id } },
      },
      { new: true }
    );
    await this.cipCache.clearAll();
    return this.Cips.populateCip(cip);
  }
  async checkoutStatusUpdate(id, status) {
    let prevCip = await this.getCip({ _id: id });
    if (prevCip.implemented.status === "Implemented") return prevCip;
    await this.Cips.updateOne(
      { _id: id },
      { $set: { "implemented.status": status } }
    );
    // if (status === "In Progress" && prevCip.implemented.status === "Pending")
    //   eventEmitter.emit(SERVER_EVENTS.OFI_IN_PROGRESS, {
    //     accessControl: this.connection,
    //     cip: prevCip,
    //   });
    await this.cipCache.clearAll();
    return prevCip;
  }
}
exports.CipCRUDOperations = CipCRUDOperations;
