const IamRoleModel = require("../models/mongodb/system/ourIms/iamRole");
const UserModel = require("../models/mongodb/system/users&auth/user");
const NotificationModel = require("../models/mongodb/system/notification/notification");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const { trimQuery } = require("../validations/utils");
const { imsPaginationFormated } = require("../services/utility");
const { models } = require("../models");
const Trigger = require("../services/triggers");
const moment = require("moment");
const { SERVER_EVENTS } = require("../events/constants");
const eventEmitter = require("../events/event-manager").getInstance();
const NotificationService = require("../services/notification");
const { mainChannel } = require("../eventsV2/topic");

exports.createNotifications = async (req, res, next) => {
  try {
    let Notification = NotificationModel(req.accessControl);
    let IamRole = IamRoleModel(req.accessControl);
    let User = UserModel(req.accessControl);
    let { message, audience, createdBy } = req.body;
    let users = await User.find({
      organization: req.accessControl.user.organizationId,
    });
    // switch (audience) {
    //   case "All users": {
    //     users = await User.find({}).select(
    //       "-password -emailVerificationToken -resetToken -phoneOtp"
    //     );
    //     break;
    //   }
    //   case "Head of services": {
    //     let hosRoles = await IamRole.find({ name: IMS_POLICIES.IMS_HOS_USER });
    //     hosRoles = hosRoles.map((role) => role._id);
    //     users = await User.find({ "accessPolicies.role": { $in: hosRoles } });
    //     break;
    //   }
    //   default:
    //     users = [];
    // }
    let notifications = await users.map((user) => {
      return new Notification({
        organization: req.accessControl.user.organizationId,
        group: null,
        user: user._id,
        referenceType: "notifications",
        referenceModule: null,
        screenIdentifier: "",
        params: {
          group: null,
          id: null,
        },
        created: {
          by: req.accessControl.user._id,
          on: Date.now(),
        },
        popUp: {
          status: "unread",
          on: Date.now(),
        },
        title: "Notice",
        msg: message,
      });
    });
    await Promise.all(notifications.map((notification) => notification.save()));
    notifications.forEach((notification) =>
      Notification.triggerToSendNotification(notification)
    );
    let notification = await Notification.populateNotification(
      notifications[0]
    );
    res
      .status(200)
      .json({ message: "Notification sent successfully", notification });
  } catch (err) {
    next(err);
  }
};
exports.nudgePeople = async (req, res, next) => {
  try {
    let trigger = new Trigger(req.accessControl);
    let { moduleName, dataId, notificationType } = req.body;
    let model = models[moduleName](req.accessControl);
    let data = await model.findOne({ _id: dataId });
    if (!data)
      return res.status(401).json({
        message: "No data found to nudge the user.",
      });
    if (data?.nextNudgeAt > Date.now())
      return res.status(400).json({
        message: `Nudging for ${data.reference} is not allowed till ${moment(
          data?.nextNudgeAt
        ).format("DD/MM/YYYY HH:MM")}`,
      });
    let payload = data._doc;
    payload.nudged = {
      by: {
        _id: req?.accessControl?.user?._id,
        name: req?.accessControl?.user?.name,
      },
      on: Date.now(),
    };
    // trigger.sendNotification(notificationType, payload, { email: true });
    mainChannel.topic(notificationType).emit({
      accessControl: req.accessControl,
      content: payload,
    });
    let module = await model.findOneAndUpdate(
      { _id: dataId },
      { $set: { nextNudgeAt: Date.now() + 86400000 } }
    );
    mainChannel.topic(SERVER_EVENTS.NUDGED_A_PERSON).emit({
      accessControl: req.accessControl,
      moduleType: moduleName,
      module: module,
      user: req?.accessControl?.user,
    });
    // eventEmitter.emit(SERVER_EVENTS.NUDGED_A_PERSON, {
    //   accessControl: req.accessControl,
    //   moduleType: moduleName,
    //   module: module,
    //   user: req?.accessControl?.user,
    // });
    res.status(200).json({
      message: "Notification has been triggered successfully",
    });
  } catch (err) {
    next(err);
  }
};
// exports.getNotifications = async (req, res, next) => {
//   try {
//     let Notification = NotificationModel(req.accessControl);
//     let { cqc, push, actor, page, sort, size, userId } = trimQuery(req.query);
//     const options = { page, limit: size, sort };
//     let query = actor ? { "created.by": userId } : { user: userId };
//     query = cqc ? { ...query, referenceType: "cqcoverviews" } : query;
//     query = push ? { ...query, referenceType: "notifications" } : query;
//     const pagination = await Notification.paginate(query, options);
//     let notifications = pagination.docs;
//     notifications = notifications.filter(
//       (notification, index, self) =>
//         index === self.findIndex((n) => n.msg === notification.msg)
//     );
//     notifications = await Promise.all(
//       notifications.map((notification) =>
//         Notification.populateNotification(notification)
//       )
//     );
//     res.status(200).json({
//       message: "Notifications retrived succeessfully.",
//       pagination: imsPaginationFormated(pagination),
//       notifications,
//     });
//   } catch (err) {
//     next(err)
//   }
// };
exports.getNotifications = async (req, res, next) => {
  let notificationManager = new NotificationService({
    connection: req.accessControl,
  });
  try {
    let { cqc, push, actor, page, sort, size, userId } = req.query;
    const options = { page, limit: size, sort };
    let query = actor ? { "created.by": userId } : { user: userId };
    query = cqc ? { ...query, referenceType: "cqcoverviews" } : query;
    query = push ? { ...query, referenceType: "notifications" } : query;
    const result = await notificationManager.listNotificationsByOrg(
      query,
      options
    );
    res.status(200).json({
      message: "Notifications retrived succeessfully.",
      pagination: result.pagination,
      notifications: result.notifications,
    });
  } catch (err) {
    next(err);
  }
};
exports.getNotification = async (req, res, next) => {
  try {
    let Notification = NotificationModel(req.accessControl);
    let { id } = req.params;
    let notification = await Notification.findOne({ _id: id });
    if (!notification)
      return res.status(400).json({
        message: "Notification not found",
      });
    notification = await Notification.populateNotification(notification);
    res.status(200).json({
      message: "Notification retrived succeessfully.",
      notification,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateNotificationsSentStatus = async (req, res, next) => {
  try {
    let Notification = NotificationModel(req.accessControl);
    let { userId } = req.params;
    await Notification.updateMany(
      { user: userId, "sent.status": "unsent" },
      { $set: { "sent.status": "sent", "sent.on": Date.now() } }
    );
    res.status(200).json({ msg: "Notifications sent" });
  } catch (err) {
    next(err);
  }
};
exports.updateNotificationReadStatus = async (req, res, next) => {
  try {
    let Notification = NotificationModel(req.accessControl);
    let { notificationId } = req.params;
    let notification = await Notification.findOneAndUpdate(
      { _id: notificationId },
      { $set: { "read.status": "read", "read.on": Date.now() } },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    next(err);
  }
};
exports.updateNotificationPopUpStatus = async (req, res, next) => {
  try {
    let Notification = NotificationModel(req.accessControl);
    let { notificationId } = req.params;
    let notification = await Notification.findOneAndUpdate(
      { _id: notificationId },
      { $set: { "popUp.status": "read", "popUp.on": Date.now() } },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    next(err);
  }
};
exports.updateBulkNotificationPopUpStatus = async (req, res, next) => {
  try {
    let Notification = NotificationModel(req.accessControl);
    let { userId } = req.params;
    await Notification.updateMany(
      { user: userId, "popUp.status": "unread" },
      { $set: { "popUp.status": "read", "popUp.on": Date.now() } }
    );
    res.json({ msg: "Notifications popUps status read" });
  } catch (err) {
    next(err);
  }
};
