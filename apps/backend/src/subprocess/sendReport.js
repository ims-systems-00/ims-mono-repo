const extractReportQueue = require("../schedules/queues/extractReport.queue");
let prepareDocumentPreview = async () => {};
process.on("message", async (message) => {
  prepareDocumentPreview(message);
  extractReportQueue.produce({
    emailOptions: {
      template: "send-dashboard-report",
      recipient: {
        name: message.subscriber.name,
        email: message.subscriber.email,
      },
      payload: {
        reciever: message.subscriber.name,
        sender: message.organization.name,
        dashBoard: message.dashBoard,
        message:
          "This is an auto generated report by iMS Systems bot. You are recieving this email because your email is subscribed by an iMS super admin.",
      },
    },
    reportOptions: {
      template: "dashboardReport",
      document: message.document,
      payload: {
        sentBy: {
          name: message.organization.name,
          email: message.organization.officeEmail || "",
        },
        sentTo: {
          name: message.subscriber.name,
          email: message.subscriber.email,
        },
        data: {
          ...message.dashBoard,
          organisationName: message.dashBoard.organizationId
            ? message.dashBoard.organizationId.name
            : message.dashBoard.groupName,
          kpiObjectives: message.kpiObjectives.map((kpi) => kpi.value),
        },
      },
    },
  });
  process.send({
    message: "Queue generated",
  });
});
