const { Manager } = require("./manager");
const { USER_TYPE } = require("@ims-systems-00/ims-core/lib/constants");

class InventoryStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async inventoryStats({ startDate, endDate }) {
    const organizationId = this.connection.user.organizationId;
    const { dateFilter } = this.getDefaultDateRange({ startDate, endDate });

    const [hardwares, softwares, peoples, premises, informations] =
      await Promise.all([
        this.HardwareAsset.find({ organization: organizationId }),
        this.SoftwareAsset.find({ organization: organizationId }),
        this.PeopleAsset.find({ organization: organizationId }),
        this.PremiseAsset.find({ organization: organizationId }),
        this.InformationAsset.find({ organization: organizationId }),
      ]);

    const users = await this.User.find({
      organization: organizationId,
      type: USER_TYPE.INTERNAL,
      "systemAccess.status": { $ne: "Deactivated" },
    });

    const hardwareCosts = hardwares.reduce(
      (total, item) => total + parseInt(item.cost || 0),
      0
    );
    const softwareCosts = softwares.reduce(
      (total, item) => total + parseInt(item.cost || 0),
      0
    );
    const informationCosts = informations.reduce(
      (total, item) => total + parseInt(item.cost || 0),
      0
    );
    const premisesCosts = premises.reduce(
      (total, item) => total + parseInt(item.cost || 0),
      0
    );
    const peopleCosts = users.reduce(
      (total, user) => total + parseInt(user.salary || 0),
      0
    );

    return {
      amounts: [
        hardwares.length,
        softwares.length,
        peoples.length,
        premises.length,
        informations.length,
      ],
      areas: ["Hardware", "Software", "People", "Premises", "Information"],
      costs: [
        hardwareCosts,
        softwareCosts,
        peopleCosts,
        premisesCosts,
        informationCosts,
      ],
    };
  }
}

module.exports = { InventoryStatsService };
