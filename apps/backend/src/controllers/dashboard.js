const { Filters } = require("../services/utility");
const DashboardService = require("../services/dashboard");
const { StatusCodes } = require("http-status-codes");

exports.getAdminDashBoard = async (req, res, next) => {
  let dashboardManager = new DashboardService(req.accessControl);
  try {
    let dashboard = await dashboardManager.getAdminDashBoard();
    res.status(StatusCodes.OK).json({ message: "Success", dashboard });
  } catch (error) {
    next(error);
  }
  // let DashBoard = DashBoardModel(req.accessControl);
  // let { session, groupPolicy } = req.accessControl;
  // try {
  //   let dashBoard = null;
  //   let iamPolicy = new IamPolicy(req.accessControl);
  //   if (iamPolicy.validateGlobalAccess(groupPolicy)) {
  //     dashBoard = await DashBoard.findOne({
  //       "systemDate.end": { $gte: Date.now() },
  //     });
  //   } else
  //     return res
  //       .status(401)
  //       .json({ message: "User unauthoried to access this resource." });
  //   res.status(200).json({ message: "Success", dashBoard });
  // } catch (err) {
  //   next(err)
  // }
};
exports.extractAdminReport = async (req, res, next) => {
  let dashboardManager = new DashboardService(req.accessControl);
  try {
    let dashboard = await dashboardManager.extractAdminReport(req.body);
    res.status(StatusCodes.OK).json({ message: "Success.", dashboard });
  } catch (error) {
    next(error);
  }

  // let DashBoard = DashBoardModel(req.accessControl);
  // let KpiObjective = KpiObjectiveModel(req.accessControl);
  // try {
  //   let { name, email, message } = req.body;
  //   let sender = req.accessControl.user;
  //   email = email.toLowerCase();
  //   let dashBoard = await DashBoard.findOne({
  //     "systemDate.end": { $gte: Date.now() },
  //   });
  //   let kpiObjectives = await KpiObjective.find({ privacy: "Organisational" });
  //   dashBoard = await DashBoard.populateDashBoard(dashBoard);
  //   let fileName = `ims-dashboard-report-${uuidv4()}.pdf`;
  //   let document = {
  //     path: `./temp/${fileName}`,
  //     fileName,
  //   };
  //   extractReportQueue.produce({
  //     emailOptions: {
  //       template: "send-dashboard-report",
  //       recipient: {
  //         name: name,
  //         email: email,
  //       },
  //       payload: {
  //         reciever: name,
  //         sender: sender.name,
  //         dashBoard,
  //         message,
  //       },
  //     },
  //     reportOptions: {
  //       template: "dashboardReport",
  //       document,
  //       payload: {
  //         sentBy: {
  //           name: sender.name,
  //           email: sender.email,
  //         },
  //         sentTo: {
  //           name: name,
  //           email: email,
  //         },
  //         data: {
  //           ...dashBoard._doc,
  //           organisationName: dashBoard.organizationId
  //             ? dashBoard.organizationId.name
  //             : dashBoard.groupName,
  //           kpiObjectives: kpiObjectives.map((kpi) => kpi.value),
  //         },
  //       },
  //     },
  //   });
  //   res.status(200).json({ message: "Report has been queued for send" });
  // } catch (err) {
  //   next(err);
  // }
};
exports.getBusinessFunctionDashBoard = async (req, res, next) => {
  let dashboardManager = new DashboardService(req.accessControl);
  try {
    let { id } = req.params;
    let dashboard = await dashboardManager.getBusinessFunctionDashBoard(id);
    res.status(StatusCodes.OK).json({ message: "Success", dashboard });
  } catch (error) {
    next(error);
  }

  // let GroupDashboard = GroupDashboardModel(req.accessControl);
  // let { session, groupPolicy } = req.accessControl;
  // try {
  //   let dashboard = await GroupDashboard.findOne({
  //     "systemDate.end": { $gte: Date.now() },
  //     group: session.current.group,
  //   });
  //   if (!dashboard)
  //     return res
  //       .status(400)
  //       .json({ message: "No dashboard found for this user." });
  //   res.status(200).json({ message: "Success", dashboard });
  // } catch (err) {
  //   next(err)
  // }
};
exports.getBusinessFunctionDashBoards = async (req, res, next) => {
  let dashboardManager = new DashboardService(req.accessControl);
  try {
    let { session, groupPolicy } = req.accessControl;
    let { page, size, sort } = req.query;
    let options = {
      page,
      limit: size,
      sort: "groupName",
      select: "groupName digitalMaturityMatrix",
    };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter };
    let results = await dashboardManager.getBusinessFunctionDashBoards(
      query,
      options
    );
    res.status(StatusCodes.OK).json({
      message: "Retrived Successfully",
      pagination: results.pagination,
      dashboards: results.dashboards,
    });
  } catch (error) {
    next(error);
  }
  // let GroupDashboard = GroupDashboardModel(req.accessControl);
  // let IamPolicyData = IamPolicyModel(req.accessControl);
  // let IamGroup = IamGroupModel(req.accessControl);
  // let { session, groupPolicy } = req.accessControl;
  // let { page, size, sort } = req.query;
  // let dashboards = [];
  // let pagination;
  // let iamPolicy = new IamPolicy(req.accessControl);
  // let options = {
  //   page,
  //   limit: size,
  //   sort: "groupName",
  //   select: "groupName digitalMaturityMatrix",
  // };
  /**
   * TODO: Only providing the business unit policy dashboards no other custom dashbord is returned
   * Will change later
   */
  // try {
  //   if (iamPolicy.validateGlobalAccess(groupPolicy)) {
  //     let businessUnitPolicy = await IamPolicyData.findOne({
  //       name: IMS_POLICIES.IMS_BUSINESS_FUNCTION,
  //     });
  //     let matchGroups = { policy: businessUnitPolicy._id };
  //     let businessUnits = await IamGroup.find({ ...matchGroups });
  //     pagination = await GroupDashboard.paginate(
  //       {
  //         "systemDate.end": { $gte: Date.now() },
  //         group: { $in: businessUnits.map((unit) => unit._id) },
  //       },
  //       options
  //     );
  //     dashboards = pagination.docs;
  //   } else
  //     return res
  //       .status(401)
  //       .json({ message: "User unauthoried to access this resource." });
  //   res.status(200).json({
  //     message: "Deshboard retrived successfully",
  //     dashboards,
  //     pagination: imsPaginationFormated(pagination),
  //   });
  // } catch (err) {
  //   next(err)
  // }
};
exports.extractBusinessFunctionDashboardReport = async (req, res, next) => {
  let dashboardManager = new DashboardService(req.accessControl);
  try {
    let { group_id } = req.params;
    let dashboard =
      await dashboardManager.extractBusinessFunctionDashboardReport(
        group_id,
        req.body
      );
    res
      .status(StatusCodes.OK)
      .json({ message: "Report Sent Successfully.", dashboard });
  } catch (error) {
    next(error);
  }

  // let BusinesssFunctionDashBoard = GroupDashboardModel(req.accessControl);
  // let KpiObjective = KpiObjectiveModel(req.accessControl);
  // try {
  //   let { name, email, message } = req.body;
  //   let sender = req.accessControl.user;
  //   email = email.toLowerCase();
  //   let { group_id } = req.params;
  //   let dashBoard = await BusinesssFunctionDashBoard.findOne({
  //     group: group_id,
  //     "systemDate.end": { $gte: Date.now() },
  //   });
  //   let kpiObjectives = await KpiObjective.find({ group: group_id });
  //   dashBoard.kpiObjectives = kpiObjectives;
  //   dashBoard = await BusinesssFunctionDashBoard.populateDashBoard(dashBoard);
  //   let fileName = `ims-dashboard-report-${uuidv4()}.pdf`;
  //   let document = {
  //     fileName,
  //     path: `./temp/${fileName}`,
  //   };
  //   extractReportQueue.produce({
  //     emailOptions: {
  //       template: "send-dashboard-report",
  //       recipient: {
  //         name: name,
  //         email: email,
  //       },
  //       payload: {
  //         reciever: name,
  //         sender: sender.name,
  //         dashBoard,
  //         message,
  //       },
  //     },
  //     reportOptions: {
  //       template: "buDashboardReport",
  //       document,
  //       payload: {
  //         sentBy: {
  //           name: sender.name,
  //           email: sender.email,
  //         },
  //         sentTo: {
  //           name: name,
  //           email: email,
  //         },
  //         data: {
  //           ...dashBoard._doc,
  //           organisationName: dashBoard.organizationId
  //             ? dashBoard.organizationId.name
  //             : dashBoard.groupName,
  //           kpiObjectives: kpiObjectives.map((kpi) => kpi.value),
  //         },
  //       },
  //     },
  //   });
  //   logger.info("Send successful !");
  //   res.status(200).json({ message: "Report sent successfully" });
  // } catch (err) {
  //   next(err);
  // }
};
exports.testSchedulde = async (req, res, next) => {
  try {
    res.status(200).json("ok");
  } catch (err) {
    next(err);
  }
};
