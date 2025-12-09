const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_EXPENSE_REPORT_SUBMISSION_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = data.payload?.report?.submission?.lineManagers || [];

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Expense report",
                  message: `${data.payload?.report?.created?.by?.name} has submitted expense report ${data.payload?.report?.reference}. Please review the report.`,
                  group: null,
                  referenceType: "expensereports",
                  referenceModule: data.payload?.report?._id,
                  screenIdentifier: `expense-report-detail`,
                  params: {
                    id: data.payload?.report?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/expense-claimed.png",
                  createdBy: data.payload?.report?.created.by._id,
                },
                { email: false }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.EXPENSE_REPORT_REVIEWED_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = [data.payload?.report?.created?.by];
        let notificationImage = "/notification-default.png";
        switch (data.payload?.report?.submission?.status) {
          case "Approved":
            notificationImage = "/approved.png";
          case "Rejected":
            notificationImage = "/declined.png";
        }

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Expense report",
                  message: `Your expense report ${data.payload?.report?.reference} has been ${data.payload?.report?.submission?.status} by ${data.payload?.report?.submission?.decisionMaker?.name}`,
                  group: null,
                  referenceType: "expensereports",
                  referenceModule: data.payload?.report?._id,
                  screenIdentifier: `expense-report-detail`,
                  params: {
                    id: data.payload?.report?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + notificationImage,
                  createdBy:
                    data.payload?.report?.submission?.decisionMaker?._id,
                },
                { email: false }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_LEAVE_REQUEST_SUBMISSION_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = data.payload?.leaveRequest?.submission?.lineManagers || [];

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Leave request",
                  message: `${data.payload?.leaveRequest?.created?.by?.name} has submitted leave request ${data.payload?.leaveRequest?.reference}. Please review the request.`,
                  group: null,
                  referenceType: "leaves",
                  referenceModule: data.payload?.leaveRequest?._id,
                  screenIdentifier: `leave-request-detail`,
                  params: {
                    id: data.payload?.leaveRequest?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/leave-request.png",
                  createdBy: data.payload?.leaveRequest?.created.by._id,
                },
                { email: false }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.LEAVE_REQUEST_REVIEWED_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = [data.payload?.leaveRequest?.created?.by];
        let notificationImage = "/notification-default.png";
        switch (data.payload?.leaveRequest?.submission?.status) {
          case "Approved":
            notificationImage = "/approved.png";
          case "Rejected":
            notificationImage = "/declined.png";
        }

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Leave request",
                  message: `Your leave request ${data.payload?.leaveRequest?.reference} has been ${data.payload?.leaveRequest?.submission?.status} by ${data.payload?.leaveRequest?.submission?.decisionMaker?.name}`,
                  group: null,
                  referenceType: "leaves",
                  referenceModule: data.payload?.leaveRequest?._id,
                  screenIdentifier: `leave-request-detail`,
                  params: {
                    id: data.payload?.leaveRequest?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + notificationImage,
                  createdBy: data.payload?.leaveRequest?.created.by._id,
                },
                { email: false }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });
}

module.exports = { register };
