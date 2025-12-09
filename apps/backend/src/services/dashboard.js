const DashBoardModel = require("../models/mongodb/system/dashboard/dashboard");
const KpiObjectiveModel = require("../models/mongodb/system/managementReview/kpiObjective");
const { imsPaginationFormated } = require("../services/utility");
const { v4: uuidv4 } = require("uuid");
const GroupDashboardModel = require("../models/mongodb/system/dashboard/groupDashboard");
const { IamPolicy } = require("../services/iamPolicy");
const extractReportQueue = require("../schedules/queues/extractReport.queue");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { basicRoleScopedFilter } = require("../queries");
const { APIError } = require("../helpers/errors/apiError");

class DashboardService {
  constructor(connection) {
    this.connection = connection;
    this.DashBoard = DashBoardModel(connection);
    this.GroupDashboard = GroupDashboardModel(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.KpiObjective = KpiObjectiveModel(connection);
  }
  async getAdminDashBoard() {
    let dashBoard = await this.DashBoard.findOneByOrg(
      this.connection?.user?.organizationId,
      {
        "systemDate.end": { $gte: Date.now() },
      }
    );
    if (!dashBoard) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Dashboard not found."
      );
    }
    return dashBoard;
  }
  async getBusinessFunctionDashBoard(id) {
    let dashboard = await this.GroupDashboard.findOneByOrg(
      this.connection?.user?.organizationId,
      {
        "systemDate.end": { $gte: Date.now() },
        group: id,
      }
    );
    if (!dashboard)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No dashboard found for this user."
      );
    return dashboard;
  }
  async getBusinessFunctionDashBoards(query, options) {
    let pagination = await this.GroupDashboard.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let dashboards = pagination.docs;
    dashboards = await Promise.all(
      dashboards.map((dashboard) =>
        this.GroupDashboard.populateDashBoard(dashboard)
      )
    );
    return { dashboards, pagination: this.imsPaginationFormated(pagination) };
  }
  async extractBusinessFunctionDashboardReport(group_id, data) {
    let { name, email, message } = data;
    let sender = this.connection.user;
    email = email.toLowerCase();
    let dashBoard = await this.GroupDashboard.findOneByOrg(
      this.connection?.user?.organizationId,
      {
        group: group_id,
        "systemDate.end": { $gte: Date.now() },
      }
    );
    let kpiObjectives = await this.KpiObjective.findByOrg(
      this.connection?.user?.organizationId,
      { group: group_id }
    );
    dashBoard.kpiObjectives = kpiObjectives;
    dashBoard = await this.GroupDashboard.populateDashBoard(dashBoard);
    let fileName = `ims-dashboard-report-${uuidv4()}.pdf`;
    let document = {
      fileName,
      path: `./temp/${fileName}`,
    };
    extractReportQueue.produce({
      emailOptions: {
        template: "send-dashboard-report",
        recipient: {
          name: name,
          email: email,
        },
        payload: {
          reciever: name,
          sender: sender.name,
          dashBoard,
          message,
        },
      },
      reportOptions: {
        template: "buDashboardReport",
        document,
        payload: {
          sentBy: {
            name: sender.name,
            email: sender.email,
          },
          sentTo: {
            name: name,
            email: email,
          },
          data: {
            ...dashBoard._doc,
            organisationName: dashBoard.organization
              ? dashBoard.organization.name
              : dashBoard.groupName,
            kpiObjectives: kpiObjectives.map((kpi) => kpi.value),
          },
        },
      },
    });
    return dashBoard;
  }
  async extractAdminReport(data) {
    let { name, email, message } = data;
    let sender = this.connection.user;
    email = email.toLowerCase();
    let dashBoard = await this.DashBoard.findOneByOrg(
      this.connection?.user?.organizationId,
      {
        "systemDate.end": { $gte: Date.now() },
      }
    );
    let kpiObjectives = await this.KpiObjective.findByOrg(
      this.connection?.user?.organizationId,
      { privacy: "Organisational" }
    );
    dashBoard = await this.DashBoard.populateDashBoard(dashBoard);
    let fileName = `ims-dashboard-report-${uuidv4()}.pdf`;
    let document = {
      path: `./temp/${fileName}`,
      fileName,
    };
    extractReportQueue.produce({
      emailOptions: {
        template: "send-dashboard-report",
        recipient: {
          name: name,
          email: email,
        },
        payload: {
          reciever: name,
          sender: sender.name,
          dashBoard,
          message,
        },
      },
      reportOptions: {
        template: "dashboardReport",
        document,
        payload: {
          sentBy: {
            name: sender.name,
            email: sender.email,
          },
          sentTo: {
            name: name,
            email: email,
          },
          data: {
            ...dashBoard._doc,
            organisationName: dashBoard.organization
              ? dashBoard.organization.name
              : dashBoard.groupName,
            kpiObjectives: kpiObjectives.map((kpi) => kpi.value),
          },
        },
      },
    });
    return dashBoard;
  }
}

module.exports = DashboardService;
