const { Manager } = require("./manager");
const { AutomationChecks } = require("./automationChecks");
const LicenseManagementService = require("../licenseManager");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
class ComplianceToolCRUDOps extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createComplianceTool(data) {
    let { name } = data;
    let licenseManagement = new LicenseManagementService(
      this.connection.user.organizationId
    );
    if (!(await licenseManagement.authorizeToolKitGrantPermission(name)))
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Organisation doesn't have tool license: " + name
      );
    let alreadyhastool = await this.ControlStatuses.findByOrg(
      this.connection.user.organizationId,
      { name }
    );
    if (alreadyhastool.length)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Organisation already has this toolkit."
      );
    let controls = await this.ComplianceControls.find({ name });
    if (!controls.length)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No controls found for " + name
      );
    for (let control of controls) {
      logger.info("Creating...", { clause: control.clause });
      await this.ControlStatuses.create({
        organization: this.connection.user.organizationId,
        name,
        control: control._id,
      });
    }
    await this.ComplianceOverview.create({
      organization: this.connection.user.organizationId,
      name,
    });
    let automation = new AutomationChecks(this.connection);
    automation.checkoutModuleEvidencedCompliance();
    return controls;
  }
  async updateComplianceTool(data) {
    // const structuredToolFromExcel = await this.initialize[data.name]();
    // let availableTenants = getConnectionMap();
    // await Promise.all(
    //   availableTenants.map(async (tenant) => {
    //     const Controls = models.compliancecontrols();
    //     const hasTool = await Controls.findOne({ name: data.name });
    //     if (hasTool) {
    //       logger(`${tenant.name}, has  , ${data.name}, now updating...`);
    //       for (let _control of structuredToolFromExcel) {
    //         const control = await Controls.findOneAndUpdate(
    //           {
    //             name: data.name,
    //             clause: _control.clause,
    //           },
    //           {
    //             title: _control.title,
    //             description: _control.description,
    //             moreInfo: _control.moreInfo,
    //             annex: _control.annex,
    //           }
    //         );
    //         logger.info(`${tenant.name}, Updated, ${control.clause}`);
    //       }
    //     } else logger.info(`${tenant.name}, has no , ${data.name}, skiping...`);
    //   })
    // );
    // return structuredToolFromExcel;
  }
  async getComplainceTool(query, options) {
    const cacheKey = this.complianceCache.createCacheKey({
      orgId: this.connection?.user?.organizationId,
      query,
      options,
    });
    let cachedResult = await this.complianceCache.get(cacheKey);
    if (cachedResult) {
      logger.info("cache hit for listControlStatuses", {cacheKey});
      return cachedResult;
    }
    let controlRefs = await this.ComplianceControls.find(query);
    controlRefs = controlRefs.map((control) => control._id);
    let pagination = await this.ControlStatuses.paginateByOrg(
      this.connection.user.organizationId,
      { control: { $in: controlRefs } },
      options
    );
    let compliance = pagination.docs;
    // logger.info("Compliance", { compliance });
    compliance = await Promise.all(
      compliance.map((control) => this.ControlStatuses.populateControl(control))
    );
    this.complianceCache.set(cacheKey, { pagination: this.imsPaginationFormated(pagination), compliance });
    logger.info("cache set for listControlStatuses", {cacheKey});
    return {
      pagination: this.imsPaginationFormated(pagination),
      compliance,
    };
  }
  async listControlStatuses(query, options) {
    
    let pagination = await this.ControlStatuses.paginateByOrg(
      this.connection.user.organizationId,
      query,
      options
    );
    let compliance = pagination.docs;
    compliance = await Promise.all(
      compliance.map((control) => this.ControlStatuses.populateControl(control))
    );

    this.complianceCache.set(cacheKey, { pagination: this.imsPaginationFormated(pagination), compliance });
    logger.info("cache set for listControlStatuses", {cacheKey});
    return {
      pagination: this.imsPaginationFormated(pagination),
      compliance,
    };
  }
  async getOverview(name) {
    return this.ComplianceOverview.findOneByOrg(
      this.connection.user.organizationId,
      { name }
    );
  }
  async getControl(query) {
    let control = await this.ControlStatuses.findOneByOrg(
      this.connection.user.organizationId,
      query
    );
    if (!control)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No control found with this query"
      );
    return this.ControlStatuses.populateControl(control);
  }
  async deleteComplianceTool(name) {
    await this.ControlStatuses.deleteMany({ name });
    await this.ComplianceOverview.deleteOne({ name });
  }
}
exports.ComplianceToolCRUDOps = ComplianceToolCRUDOps;
