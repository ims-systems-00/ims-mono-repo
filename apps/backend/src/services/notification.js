const { asynchronously } = require("./utility");
const NotificationModel = require("../models/mongodb/system/notification/notification");
const IamGroupModel = require("../models/mongodb/system/ourIms/iamGroup");
const IamRoleModel = require("../models/mongodb/system/ourIms/iamRole");
const UserModel = require("../models/mongodb/system/users&auth/user");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const notificationListeners = require("../socket/listeners/notification.listener");
const { imsPaginationFormated } = require("./utility");
const { sendMail } = require("../email/sendMail");
class NotificationService {
  constructor(config) {
    this.connection = config.connection;
    this.Notification = NotificationModel(config.connection);
    this.IamGroup = IamGroupModel(config.connection);
    this.IamRole = IamRoleModel(config.connection);
    this.User = UserModel(config.connection);
    this.imsPaginationFormated = imsPaginationFormated;
  }
  async createNotice(data, callBack) {
    let {
      title,
      referenceType,
      id,
      screenIdentifier,
      message,
      audience,
      createdBy,
      group,
    } = data;
    let audiences = [];
    switch (audience) {
      case "All users": {
        let users = await this.User.find({
          "accessPolicies.group": group,
        }).select("-password -emailVerificationToken -resetToken -phoneOtp");
        audiences = users;
        break;
      }
      case "Head of services": {
        let hosRoles = await this.IamRole.find({
          name: IMS_POLICIES.IMS_HOS_USER,
        });
        hosRoles = hosRoles.map((role) => role._id);
        let users = await this.User.find({
          "accessPolicies.group": group,
          "accessPolicies.role": { $in: hosRoles },
        });
        audiences = users;
        break;
      }
      default:
        users = [];
    }
    let notifications = await Promise.all(
      audiences.map((user) =>
        this.Notification.create({
          group: null,
          user: user._id,
          referenceType: referenceType,
          screenIdentifier: screenIdentifier,
          params: {
            groupId: group,
            id: id,
          },
          popUp: data.popUp ? data.popUp : null,
          created: {
            by: createdBy,
            on: Date.now(),
          },
          title: title,
          msg: message,
        })
      )
    );
    notifications.forEach((notification) =>
      this.Notification.triggerToSendNotification(notification)
    );
    return Promise.all(
      notifications.map((notification) =>
        this.Notification.populateNotification(notification)
      )
    );
  }
  async notify(data, callBack) {
    let {
      title,
      referenceType,
      referenceModule,
      popUpStatus,
      icon,
      params,
      screenIdentifier,
      message,
      audiences,
      createdBy,
    } = data;
    audiences = audiences || [];
    let notifications = await Promise.all(
      audiences.map((user) =>
        this.Notification.create({
          group: null,
          organization: this.connection.user?.organizationId,
          user: user._id,
          referenceType: referenceType,
          referenceModule: referenceModule,
          screenIdentifier: screenIdentifier,
          params: params,
          popUp: {
            status: popUpStatus,
            on: Date.now(),
          },
          icon,
          created: {
            by: createdBy,
            on: Date.now(),
          },
          title: title,
          msg: message,
        })
      )
    );
    notifications.forEach((notification) =>
      notificationListeners(notification)
    );
    const populatedNotifications = await Promise.all(
      notifications.map((notification) =>
        this.Notification.populateNotification(notification)
      )
    );

    return populatedNotifications;
  }
  getNotificationScreens({
    moduleType = "dashboards",
    preFix = "",
    postFix = "",
  }) {
    const notificationScreens = {
      audits: "dashboard",
      calenderevents: "",
      cips: "continual-improvement-plan-detail",
      dashboards: "dashboard",
      documents: "",
      hardwareassets: "",
      incidents: "incident-management-detail",
      kpiobjectives: "",
      managementreviews: "",
      notifications: "",
      organizationalassets: "",
      organizations: "",
      peopleassets: "",
      premiseassets: "",
      risks: "risk-management-detail",
      softwareassets: "",
      suppliers: "",
      tasks: "task-manager-detail",
      users: "",
      licenserequests: "",
      complaints: "",
      cqcsignificantevents: "significant-event-detail",
      cqcsafeguardings: "safeguarding-detail",
      cqcreports: "",
      cqcoverviews: "",
      cqcwhistleblows: "",
      cqcdetails: "",
      controlstatuses: "control-status",
    };
    preFix = preFix && preFix + "-";
    postFix = postFix && "-" + postFix;
    return `${preFix}${notificationScreens[moduleType]}${postFix}`;
  }
  async listNotificationsByOrg(query, options) {
    let pagination = await this.Notification.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query },
      options
    );
    let notifications = pagination.docs;
    notifications = await Promise.all(
      notifications.map((notification) =>
        this.Notification.populateNotification(notification)
      )
    );
    return {
      notifications,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async notifyV2(data, config) {
    if (!data) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    }

    let {
      title,
      referenceType,
      referenceModule,
      popUpStatus,
      icon,
      params,
      screenIdentifier,
      message,
      user,
      createdBy,
    } = data;
    let notification = await this.Notification.create({
      group: null,
      organization: this.connection.user?.organizationId,
      user: user,
      referenceType: referenceType,
      referenceModule: referenceModule,
      screenIdentifier: screenIdentifier,
      params: params,
      popUp: {
        status: popUpStatus,
        on: Date.now(),
      },
      icon,
      created: {
        by: createdBy,
        on: Date.now(),
      },
      title: title,
      msg: message,
    });

    let recipientUser = await this.User.findOne({ _id: user });

    if (config.email == true) {
      await sendMail("user-notification", recipientUser.email, {
        recipient: recipientUser,
        notification: {
          ...notification._doc,
          message: notification.msg,
        },
        loginLink: `${process.env.CLIENT_URL}/admin/notificaion-redirection/?notification=${notification._id}&user=${notification.user._id}`,
      });
    }

    await notificationListeners(notification);

    let populateNotifications =
      this.Notification.populateNotification(notification);

    return populateNotifications;
  }
}

module.exports = NotificationService;
