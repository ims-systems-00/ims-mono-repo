const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { basicRoleScopedFilter } = require("../../queries");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

class KpiObjectiveService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async addKpiObjective(data) {
    let { value, group, privacy, moduleType, module, targetValue, unit } = data;
    let kpiObjective = await this.KpiObjectives.create({
      organization: this.connection.user.organizationId,
      value,
      group,
      privacy,
      moduleType,
      module,
      targetValue,
      unit,
      created: {
        by: data.createdBy,
        on: Date.now(),
      },
    });
    kpiObjective = await kpiObjective.save();
    kpiObjective = await this.KpiObjectives.populateKpiObjective(kpiObjective);
    // this.trigger.sendNotification("newKpiEvent", kpiObjective);
    mainChannel.topic(SERVER_EVENTS_BUS.NEW_KPI_EVENT).emit({
      accessControl: this.connection,
      kpiObjective,
    });
    return kpiObjective;
  }
  async updateKpiObjective(id, data) {
    let kpiObjective = await this.getKpiObjective(id);
    Object.keys(data).map((key) => {
      kpiObjective[key] = data[key];
    });
    if (kpiObjective.currentValue > kpiObjective.targetValue) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Current Value must be less than target value"
      );
    }
    kpiObjective = await kpiObjective.save();
    return this.KpiObjectives.populateKpiObjective(kpiObjective);
  }
  async getKpiObjective(id) {
    let kpiObjective = await this.KpiObjectives.findOne({ _id: id });
    if (!kpiObjective)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Kpi Objectives not found with given id"
      );
    return this.KpiObjectives.populateKpiObjective(kpiObjective);
  }
  async removeKpiObjective(id) {
    let kpiObjective = await this.getKpiObjective(id);
    if (kpiObjective) {
      await this.KpiObjectives.deleteOne({ _id: id });
    }
    return kpiObjective;
  }
  async listKpiObjectivesByOrg(query, options) {
    let pagination = await this.KpiObjectives.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let kpiObjectives = pagination.docs;
    kpiObjectives = await Promise.all(
      kpiObjectives.map((kpiObjective) =>
        this.KpiObjectives.populateKpiObjective(kpiObjective)
      )
    );
    return {
      kpiObjectives,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
}

module.exports = KpiObjectiveService;
