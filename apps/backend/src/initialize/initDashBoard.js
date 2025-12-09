const DashBoardModel = require("../models/mongodb/system/dashboard/dashboard");
const GroupDashboardModel = require("../models/mongodb/system/dashboard/groupDashboard");

exports.initOrganizationDashboard = (accessControl) => (organization) => {
  return new Promise(async (resolve, reject) => {
    let DashBoard = DashBoardModel(accessControl);
    try {
      let { start, end } = organization.systemDate;
      let dashboard = new DashBoard({
        organizationId: organization._id,
        systemDate: {
          start,
          end,
        },
      });
      await dashboard.save();
      resolve(dashboard);
    } catch (err) {
      reject(err);
    }
  });
};
exports.initGroupDashboard = (accessControl) => (group) => {
  return new Promise(async (resolve, reject) => {
    let GroupDashboard = GroupDashboardModel(accessControl);
    let Organization =
      require("../models/mongodb/system/organization/organization")(
        accessControl
      );
    try {
      let organization = await Organization.findOne({
        _id: accessControl?.user?.organizationId,
      });
      let { start, end } = organization.systemDate;
      let dashboard = new GroupDashboard({
        group: group._id,
        organization: accessControl?.user?.organizationId,
        groupName: group.name,
        systemDate: {
          start,
          end,
        },
      });
      await dashboard.save();
      resolve(dashboard);
    } catch (err) {
      reject(err);
    }
  });
};
