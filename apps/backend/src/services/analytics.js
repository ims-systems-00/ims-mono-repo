const { asyncWrapper, DateUtils, asynchronously } = require("./utility");
const CQCComplaintModel = require("../models/mongodb/system/cqc/cqcComplaint");
const CQCToolModel = require("../models/mongodb/system/cqc/cqcTool");
const CQCDetailModel = require("../models/mongodb/system/cqc/cqcDetails");
const CQCOverviewModel = require("../models/mongodb/system/cqc/cqcOverview");
const CQCReportModel = require("../models/mongodb/system/cqc/cqcReport");
const CQCWhistleBlowModel = require("../models/mongodb/system/cqc/cqcWhistleBlow");
const CQCSafeGuardingModel = require("../models/mongodb/system/cqc/cqcSafeGuarding");
const CQCSignificantEventModel = require("../models/mongodb/system/cqc/cqcSignificantEvent");
const IamGroupModel = require("../models/mongodb/system/ourIms/iamGroup");
const UserModel = require("../models/mongodb/system/users&auth/user");
const IncidentModel = require("../models/mongodb/system/incidentManagement/incident");
const CustomerModel = require("../models/mongodb/system/crm/customer");
const EmailCampaignModel = require("../models/mongodb/system/crm/emailCampaign");
const InvoiceModel = require("../models/mongodb/system/crm/invoice");
const ActivityModel = require("../models/mongodb/system/activity/activity");
const DocumentTreeModel = require("../models/mongodb/system/documentManagement/documentTree");
const FileHandlerService = require("./fileHandler");
const moment = require("moment");
const mongoose = require("mongoose");
class AnalyticsService extends FileHandlerService {
  constructor(connection) {
    super(connection);
    this.connection = connection;
    this.CQCComplaint = CQCComplaintModel(connection);
    this.CQCTool = CQCToolModel(connection);
    this.CQCDetail = CQCDetailModel(connection);
    this.CQCOverview = CQCOverviewModel(connection);
    this.CQCReport = CQCReportModel(connection);
    this.IamGroup = IamGroupModel(connection);
    this.User = UserModel(connection);
    this.EmailCampaign = EmailCampaignModel(connection);
    this.CQCWhistleBlow = CQCWhistleBlowModel(connection);
    this.CQCSafeGuarding = CQCSafeGuardingModel(connection);
    this.CQCSignificantEvent = CQCSignificantEventModel(connection);
    this.Invoice = InvoiceModel(connection);
    this.Customer = CustomerModel(connection);
    this.Incident = IncidentModel(connection);
    this.Activity = ActivityModel(connection);
    this.Activity = ActivityModel(connection);
    this.DocumentTree = DocumentTreeModel(connection);
  }
  async analyzeCQCComplaints(group) {
    let [compliants, compliantsError] = await asyncWrapper(() =>
      this.CQCComplaint.find({ group }).sort("-createdAt")
    );
    let signedOffAmount = compliants.filter(
      (complaint) => complaint.signed.status
    ).length;
    let openAmount = compliants.length - signedOffAmount;
    if (compliantsError) return [compliants, compliantsError];
    return asyncWrapper(() =>
      this.CQCOverview.findOneAndUpdate(
        { group },
        {
          $set: {
            "complaints.open": openAmount,
            "complaints.signedOff": signedOffAmount,
          },
        }
      )
    );
  }
  async analyzeCQCSafeguardings(group) {
    let [safeguardings, safeguardingsError] = await asyncWrapper(() =>
      this.CQCSafeGuarding.find({ group }).sort("-createdAt")
    );
    let signedOffAmount = safeguardings.filter(
      (safeguarding) => safeguarding.signed.status
    ).length;
    let openAmount = safeguardings.length - signedOffAmount;
    if (safeguardingsError) return [safeguardings, safeguardingsError];
    return asyncWrapper(() =>
      this.CQCOverview.findOneAndUpdate(
        { group },
        {
          $set: {
            "safeGuardings.open": openAmount,
            "safeGuardings.signedOff": signedOffAmount,
          },
        }
      )
    );
  }
  async analyzeCQCSignificantEvents(group) {
    let [significantEvents, significantEventsError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.find({ group }).sort("-createdAt")
    );
    let signedOffAmount = significantEvents.filter(
      (significantEvent) => significantEvent.signed.status
    ).length;
    let openAmount = significantEvents.length - signedOffAmount;
    if (significantEventsError)
      return [significantEvents, significantEventsError];
    return asyncWrapper(() =>
      this.CQCOverview.findOneAndUpdate(
        { group },
        {
          $set: {
            "significantEvents.open": openAmount,
            "significantEvents.signedOff": signedOffAmount,
          },
        }
      )
    );
  }
  async analyzeCQCWhistleBlows(group) {
    let [whistleblows, whistleblowsError] = await asyncWrapper(() =>
      this.CQCWhistleBlow.find({ group }).sort("-createdAt")
    );
    let signedOffAmount = whistleblows.filter(
      (whistleblow) => whistleblow.signed.status
    ).length;
    let openAmount = whistleblows.length - signedOffAmount;
    if (whistleblowsError) return [whistleblows, whistleblowsError];
    return asyncWrapper(() =>
      this.CQCOverview.findOneAndUpdate(
        { group },
        {
          $set: {
            "whistleBlows.open": openAmount,
            "whistleBlows.signedOff": signedOffAmount,
          },
        }
      )
    );
  }
  async analyzeCustomersForManager(managerId) {
    let dateUtils = new DateUtils(new Date());
    const MONTH_OF_YEAR = [
      "",
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    let groupCustomers = this.Customer.aggregate([
      {
        $match: { accountManager: new mongoose.Types.ObjectId(managerId) },
      },
      {
        $group: {
          _id: { stage: "$stage" },
          contractValue: { $sum: "$contractValue" },
          count: { $sum: 1 },
        },
      },
    ]);
    let getActiveCampaign = this.EmailCampaign.aggregate([
      {
        $match: {
          "created.by": new mongoose.Types.ObjectId(managerId),
          closed: false,
        },
      },
      {
        $group: {
          _id: { name: "$name" },
          count: { $sum: 1 },
        },
      },
    ]);
    let getClosedCampaign = this.EmailCampaign.aggregate([
      {
        $match: {
          "created.by": new mongoose.Types.ObjectId(managerId),
          closed: true,
        },
      },
      {
        $group: {
          _id: { name: "$name" },
          count: { $sum: 1 },
        },
      },
    ]);
    let getCampaignsLast6Month = this.EmailCampaign.aggregate([
      {
        $match: {
          "created.by": new mongoose.Types.ObjectId(managerId),
          launchedAt: {
            $gte: dateUtils.addMonths(-6),
            $lte: dateUtils.getLastDateOfMonth(),
          },
        },
      },
      {
        $group: {
          _id: { year_month: { $substrCP: ["$launchedAt", 0, 7] } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year_month": -1 },
      },
      {
        $project: {
          _id: {
            $concat: [
              {
                $arrayElemAt: [
                  MONTH_OF_YEAR,
                  {
                    $toInt: { $substrCP: ["$_id.year_month", 5, 7] },
                  },
                ],
              },
            ],
          },
          count: 1,
        },
      },
    ]);
    let getTotalInvoiceAmountThisMonth = this.Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: dateUtils.getFirstDateOfMonth() },
          accountManager: new mongoose.Types.ObjectId(managerId),
        },
      },
      {
        $group: {
          _id: { status: "$status" },
          calculations: { $sum: "$calculations.total" },
          count: { $sum: 1 },
        },
      },
    ]);
    let contractsStartedThisMonth = this.Customer.countDocuments({
      accountManager: managerId,
      contractStartDate: {
        $gte: dateUtils.getFirstDateOfMonth(),
        $lte: dateUtils.getLastDateOfMonth(),
      },
    });
    let contractsEndedThisMonth = this.Customer.countDocuments({
      accountManager: managerId,
      contractEndDate: {
        $gte: dateUtils.getFirstDateOfMonth(),
        $lte: dateUtils.getLastDateOfMonth(),
      },
    });
    let contractsReviewThisMonth = this.Customer.countDocuments({
      accountManager: managerId,
      reviewDate: {
        $gte: dateUtils.getFirstDateOfMonth(),
        $lte: dateUtils.getLastDateOfMonth(),
      },
    });
    let mostValuedCustomer = this.Customer.find({ accountManager: managerId })
      .sort("-contractValue")
      .limit(1);

    let mostValuedLiveCustomer = this.Customer.find({
      accountManager: managerId,
      stage: "Live",
    })
      .sort("-contractValue")
      .limit(1);
    let lessValuedLiveCustomer = this.Customer.find({
      accountManager: managerId,
      stage: "Live",
    })
      .sort("contractValue")
      .limit(1);
    let getLatestCampaign = this.EmailCampaign.find({
      "created.by": managerId,
      rootCampaign: true,
    })
      .sort("-createdAt")
      .limit(1);
    let getAllManagedCustomers = this.Customer.aggregate([
      {
        $match: { accountManager: new mongoose.Types.ObjectId(managerId) },
      },
      {
        $group: {
          _id: { group: "$group" },
        },
      },
    ]);
    let [analysisError, analytics] = await asynchronously(
      Promise.all([
        groupCustomers,
        getTotalInvoiceAmountThisMonth,
        contractsStartedThisMonth,
        contractsEndedThisMonth,
        contractsReviewThisMonth,
        mostValuedCustomer,
        mostValuedLiveCustomer,
        lessValuedLiveCustomer,
        getActiveCampaign,
        getClosedCampaign,
        getCampaignsLast6Month,
        getLatestCampaign,
        getAllManagedCustomers,
      ])
    );
    if (analysisError) return [analysisError, analytics];
    let [monthlyInteractionAnalysisError, monthlyinteractions] =
      await this.analyzeCustomerInteractions({
        group: { $in: analytics[12]?.map((cus) => cus?._id?.group) },
      });
    let [weeklyInteractionAnalysisError, weeklyinteractions] =
      await this.analyzeCustomerInteractions({
        timeFrame: "weekly",
        group: { $in: analytics[12]?.map((cus) => cus?._id?.group) },
      });
    return {
      customerAnalysis: analytics[0],
      invoiceAnalysis: analytics[1],
      contractStartedThisMonth: analytics[2],
      contractEndingThisMonth: analytics[3],
      contractReviewThisMonth: analytics[4],
      highestValueCustomer: {
        name: analytics[5][0] ? analytics[5][0].name : "Not available",
        value: analytics[5][0] ? analytics[5][0].contractValue : 0,
        stage: analytics[5][0] ? analytics[5][0].stage : "",
      },
      mostValuedLiveCustomer: {
        name: analytics[6][0] ? analytics[6][0].name : "Not available",
        value: analytics[6][0] ? analytics[6][0].contractValue : 0,
        stage: analytics[6][0] ? analytics[6][0].stage : "",
      },
      lessValuedLiveCustomer: {
        name: analytics[7][0] ? analytics[7][0].name : "Not available",
        value: analytics[7][0] ? analytics[7][0].contractValue : 0,
        stage: analytics[7][0] ? analytics[7][0].stage : "",
      },
      activeCampaign: analytics[8].length,
      closedCampaign: analytics[9].length,
      monthlyCampaign: analytics[10],
      latestCampaign: analytics[11][0]
        ? analytics[11][0].name
        : "No recent campaign",
      interactions: {
        weekly: weeklyinteractions,
        monthly: monthlyinteractions,
      },
    };
  }
  async analyzeCustomerInteractions(query) {
    let dateUtils = new DateUtils(new Date());
    /**
     * the following query matches the activities related a particular group otherwise
     * it finds the activiteis in the whole organisation,
     */
    let groupMatch = query?.group ? { group: query?.group } : {};
    /**
     * the following query sets up a date boundary to only give the analytics for a
     * scpecific time frame, in this case weekly and monthly
     */
    let dateMatch =
      query?.timeFrame === "weekly"
        ? { "created.on": { $gte: dateUtils.getFirstDateOfWeek() } }
        : { "created.on": { $gte: dateUtils.getFirstDateOfMonth() } };
    /**
     * Final combined query all together
     */
    query = { ...groupMatch, ...dateMatch };
    let groupCustomers = this.Activity.aggregate([
      {
        $match: {
          moduleType: "customers",
          ...query,
        },
      },
      {
        $group: {
          _id: { customer: "$module" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    let countTotalInteractions = this.Activity.countDocuments({
      moduleType: "customers",
      ...query,
    });
    let [analyticsError, analytics] = await asynchronously(
      Promise.all([groupCustomers, countTotalInteractions])
    );
    let customers = analytics[0]?.slice(0, 5);
    let getCustomers = this.Customer.find({
      _id: { $in: customers.map((customer) => customer?._id?.customer) },
    }).select("name");
    let foundCustomers = await getCustomers;
    customers = customers?.map((customer) => {
      let details = foundCustomers?.find(
        (c) => c?._id?.toString() === customer?._id?.customer?.toString()
      );
      return {
        ...details?._doc,
        interactionCount: customer.count,
      };
    });
    return [
      null,
      {
        customersEngaged: analytics[0]?.length,
        totalInteractions: analytics[1],
        topCustomersEngaged: customers,
      },
    ];
  }
  async analyzeDocumentManagement() {
    const [
      totalProcesses,
      totalStandaredOperatingProcedures,
      totalPolicies,
      totalDocuments,
      totalLegal,
      totalMiscellaneous,
    ] = await Promise.all([
      this.DocumentTree.countDocumentsByOrg(
        this.connection.user.organizationId,
        {
          status: "Published",
          type: "document",
          "documentData.purpose": "Process",
        }
      ),
      this.DocumentTree.countDocumentsByOrg(
        this.connection.user.organizationId,
        {
          status: "Published",
          type: "document",
          "documentData.purpose": "Standard operating procedure",
        }
      ),
      this.DocumentTree.countDocumentsByOrg(
        this.connection.user.organizationId,
        {
          status: "Published",
          type: "document",
          "documentData.purpose": "Policy",
        }
      ),
      this.DocumentTree.countDocumentsByOrg(
        this.connection.user.organizationId,
        {
          status: "Published",
          type: "document",
          "documentData.purpose": "Document",
        }
      ),
      this.DocumentTree.countDocumentsByOrg(
        this.connection.user.organizationId,
        {
          status: "Published",
          type: "document",
          "documentData.purpose": "Legal",
        }
      ),
      this.DocumentTree.countDocumentsByOrg(
        this.connection.user.organizationId,
        {
          status: "Published",
          type: "document",
          "documentData.purpose": "Miscellaneous",
        }
      ),
    ]);
    return {
      totalDocuments,
      totalStandaredOperatingProcedures,
      totalPolicies,
      totalProcesses,
      totalLegal,
      totalMiscellaneous,
    };
  }
}

module.exports = AnalyticsService;
