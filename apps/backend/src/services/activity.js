const UserModel = require("../models/mongodb/system/users&auth/user");
const { asynchronously, imsPaginationFormated } = require("./utility");
const ActivityModel = require("../models/mongodb/system/activity/activity");
const { CipCRUDOperations } = require("./cip");
const NotificationService = require("./notification");
const { basicRoleScopedFilter } = require("../queries");
const { APIError } = require("../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
class ActivityService {
  constructor(connection) {
    this.connection = connection;
    this.Activity = ActivityModel(connection);
    this.User = UserModel(connection);
    this.imsPaginationFormated = imsPaginationFormated;
  }
  async createActivity(data) {
    let activity = await this.Activity.create({
      organization: this.connection.user.organizationId,
      moduleType: data.moduleType,
      module: data.moduleId,
      group: null,
      assigned: { to: null, on: Date.now() },
      value: data.value,
      metaInfo: data.metaInfo || null,
      isAutomated: data.isAutomated,
      iconSrc: data.iconSrc,
      extraLogs: data.extraLogs || [],
      created: { by: data.createdBy, on: Date.now() },
    });
    await this.activityFollowUps(data);
    return this.Activity.populateActivity(activity);
  }
  async createNotifications(activity) {
    let notificaionService = new NotificationService({
      connection: this.connection,
    });
    let module = activity.module;
    let group = module.group ? module.group._id : null;
    let userId = module.created && module.created.by && module.created.by._id;
    let query = {
      $or: [{ "accessPolicies.group": group }, { _id: userId }],
    };
    if (group || userId) {
      let audiences = await this.User.find(query);
      let data = {
        organization: this.connection.user.organizationId,
        title: "Activity",
        referenceType: activity.moduleType,
        referenceModule: null,
        params: { id: module._id },
        screenIdentifier: notificaionService.getNotificationScreens({
          moduleType: activity.moduleType,
          preFix: `${module.type}`,
        }),
        message: `${activity.created.by.name} commented on ${module.reference}`,
        audiences,
        popUpStatus: "read",
        createdBy: activity.created.by._id,
        group: group,
      };
      notificaionService.notify(data);
    }
  }
  async getActivities(query, options) {
    let pagination = await this.Activity.paginate(query, options);
    let activities = pagination.docs;
    let populatedData = await Promise.all(
      activities.map((activity) => this.Activity.populateActivity(activity))
    );
    return {
      activities: populatedData,
      pagination: imsPaginationFormated(pagination),
    };
  }
  async listActivitiesByOrg(query, options) {
    let pagination = await this.Activity.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let activities = pagination.docs;
    activities = await Promise.all(
      activities.map((activity) => this.Activity.populateActivity(activity))
    );
    return {
      activities,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getAcivity(id) {
    let activity = await this.Activity.findOne({ _id: id });
    if (!activity)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Activity not found with given id."
      );
    return this.Activity.populateActivity(activity);
  }
  async updateActivity(id, data) {
    let activity = await this.Activity.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          value: data.value,
        },
      },
      { new: true }
    );
    return this.Activity.populateActivity(activity);
  }
  async deleteActivity(id) {
    let activity = await this.getAcivity(id);
    if (activity) {
      await this.Activity.deleteOne({ _id: id });
    }
    return activity;
  }
  async activityFollowUps(data) {
    let cipService = new CipCRUDOperations(this.connection);
    switch (data.moduleType) {
      case "cips": {
        return asynchronously(
          cipService.checkoutStatusUpdate(data.moduleId, "In Progress")
        );
      }
      default:
        return [null, "Nothing as followup."];
    }
  }
}
module.exports = ActivityService;
