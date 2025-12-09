const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const moment = require("moment");
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { ProgramProfiler } = require("../../helpers/programProfiler");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { basicRoleScopedFilter } = require("../../queries");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

class RiskManagementService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createRisk(data) {
    let risk = new this.Risks({
      organization: this.connection.user.organizationId,
      group: data.group,
      tagsAndCategories: data.tagsAndCategories,
      owner: data.owner,
      title: data.title,
      type: data.type,
      assetReferarence: `${data.type}asset`,
      description: data.description,
      asset: data.asset,
      attachments: data.attachments ? data.attachments : [],
      score: {
        likelihood: { initial: data.likelihood, current: data.likelihood },
        consequence: { initial: data.consequence, current: data.consequence },
        total: {
          initial: data.likelihood * data.consequence,
          current: data.likelihood * data.consequence,
        },
      },
      source: {
        moduleType: data.moduleType || "",
        module: data.module || null,
      },
      created: {
        by: data.createdBy._id,
        on: Date.now(),
      },
    });
    logger.info("data-recieved:", data);
    const insertOps = new ProgramProfiler();
    const populationOps = new ProgramProfiler();
    const totalOps = new ProgramProfiler();
    totalOps.opsStart();
    insertOps.opsStart();
    risk = await risk.save();
    logger.info("insertOps", insertOps.opsEnd());
    populationOps.opsStart();
    risk = await this.Risks.populateRisk(risk);
    logger.info("poppulatioOps", populationOps.opsEnd());
    logger.info("totalOps", totalOps.opsEnd());
    //notification
    let users = [data.owner];
    mainChannel.topic(SERVER_EVENTS_BUS.NEW_RISK_OWNER_EVENT).emit({
      accessControl: this.connection,
      risk,
      users,
    });
    mainChannel.topic(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE).emit({
      accessControl: this.connection,
      moduleType: moduleTypes.incidents,
      user: data.createdBy,
    });
    mainChannel.topic(SERVER_EVENTS.RISK_CREATED).emit({
      accessControl: this.connection,
      risk,
    });

    // Clear cache when a new risk is created
    await this.riskCache.clearAll();

    return risk;
  }

  async updateRisk(id, data) {
    try {
      let prevRisk = await this.getRisk({ _id: id });
      if (prevRisk.mitigated.status) {
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "This risk is already mitigated."
        );
      }

      const mutations = { ...data };
      delete mutations["attachments"];
      delete mutations["mitigationStatus"];
      delete mutations["acceptanceStatus"];
      delete mutations["likelihood"];
      delete mutations["consequence"];

      let risk = await this.Risks.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            ...mutations,
            "mitigated.status": data.mitigationStatus,
            "accepted.status": data.acceptanceStatus,
            score: {
              likelihood: {
                initial: prevRisk.score.likelihood.initial,
                current: data.likelihood,
              },
              consequence: {
                initial: prevRisk.score.consequence.initial,
                current: data.consequence,
              },
              total: {
                initial: data.likelihood * data.consequence,
                current: data.likelihood * data.consequence,
              },
            },
            updated: {
              by: data.updatedBy._id,
              on: Date.now(),
            },
          },
          $push: { attachments: data.attachments ? data.attachments : [] },
        },
        { new: true }
      );

      if (!risk) {
        throw new APIError(
          ReasonPhrases.BAD_REUEST,
          StatusCodes.BAD_REQUEST,
          "Failed to update risk"
        );
      }

      risk = await this.Risks.populateRisk(risk);

      if (prevRisk.owner?._id?.toString() !== risk.owner?._id?.toString()) {
        let users = [risk.owner];
        mainChannel.topic(SERVER_EVENTS_BUS.NEW_RISK_OWNER_EVENT).emit({
          accessControl: this.connection,
          risk,
          users,
        });

        mainChannel.topic(SERVER_EVENTS.RISK_OWNERSHIP_CHANGED).emit({
          accessControl: this.connection,
          user: data.updatedBy,
          prevRisk,
          risk,
        });
      }

      if (risk.mitigated.status) {
        mainChannel.topic(SERVER_EVENTS_BUS.MITIGATE_RISK_EVENT).emit({
          accessControl: this.connection,
          risk,
        });
        mainChannel.topic(SERVER_EVENTS.RISK_MITIGATED).emit({
          accessControl: this.connection,
          risk,
        });
      }

      if (risk.accepted.status) {
        mainChannel.topic(SERVER_EVENTS.RISK_ACCEPTED).emit({
          accessControl: this.connection,
          risk,
        });
      }

      if (data.attachments?.length) {
        mainChannel.topic(SERVER_EVENTS.ATTACHMENT_ADDED).emit({
          accessControl: this.connection,
          moduleType: moduleTypes.risks,
          module: risk,
          user: data.updatedBy,
          attachments: data.attachments,
        });
      }

      // Clear cache
      await this.riskCache.clearAll();

      return risk;
    } catch (error) {
      console.error("Error updating risk:", error);
      throw error;
    }
  }

  async listRisks(query, options) {
    let pagination = await this.Risks.paginate(query, options);
    let risks = pagination.docs;
    risks = await Promise.all(
      risks.map((risk) => this.Risks.populateRisk(risk))
    );

    const result = {
      risks,
      pagination: this.imsPaginationFormated(pagination),
    };

    // Cache the result
    // await this.riskCache.set(cacheKey, result);

    return result;
  }

  async listRisksByOrg(query, options) {
    // Create cache key for org
    const cacheKey = this.riskCache.createCacheKey({
      orgId: this.connection?.user?.organizationId,
      query,
      options,
    });

    let cachedResult = await this.riskCache.get(cacheKey);
    if (cachedResult) {
      logger.info("cache hit for listRisksByOrg", {cacheKey});
      return cachedResult;
    }

    let pagination = await this.Risks.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let risks = pagination.docs;
    risks = await Promise.all(
      risks.map((risk) => this.Risks.populateRisk(risk))
    );

    const result = {
      risks,
      pagination: this.imsPaginationFormated(pagination),
    };

    // Cache the result
    await this.riskCache.set(cacheKey, result);
    logger.info("cache set for listRisksByOrg", {cacheKey});
    return result;
  }

  async getRisk(query) {
    let risk = await this.Risks.findOneByOrg(
      this.connection?.user?.organizationId,
      query
    );
    if (!risk)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No risk was found with the query."
      );
    risk = await this.Risks.populateRisk(risk);
    return risk;
  }

  async deleteRisk(query) {
    const totalOps = new ProgramProfiler();
    const deleteOps = new ProgramProfiler();
    const findOps = new ProgramProfiler();
    totalOps.opsStart();
    findOps.opsStart();
    let risk = await this.getRisk(query);
    logger.info("findOps", findOps.opsEnd());
    deleteOps.opsStart();
    await this.Risks.deleteOne(query);
    logger.info("deleteOps", deleteOps.opsEnd());
    logger.info("totalOps", totalOps.opsEnd());

    // Clear cache
    await this.riskCache.clearAll();

    return risk;
  }
  async mitigateRisk(id, data) {
    let risk = await this.getRisk({ _id: id });
    if (risk.mitigated.status)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This risk is already mitigated"
      );
    risk = await this.Risks.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          controlsAndMitigation: data.controlsAndMitigation,
          mitigated: {
            status: data.mitigationStatus,
            by: data.mitigationStatus ? data.mitigatedBy._id : null,
            on: data.mitigationStatus ? Date.now() : null,
          },
        },
      },
      { new: true }
    );
    risk = await this.Risks.populateRisk(risk);
    // eventEmitter.emit(SERVER_EVENTS.RISK_MITIGATED, {
    //   accessControl: this.connection,
    //   risk,
    // });
    mainChannel.topic(SERVER_EVENTS.RISK_MITIGATED).emit({
      accessControl: this.connection,
      risk,
    });

    // Clear cache
    await this.riskCache.clearAll();

    return risk;
  }

  async acceptRisk(id, data) {
    let risk = await this.getRisk({ _id: id });
    risk = await this.Risks.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          acceptanceRational: data.acceptanceRational,
          decisionMaker: data.decisionMaker,
          accepted: {
            status: data.acceptanceStatus,
            by: data.acceptanceStatus ? data.updatedBy._id : null,
            on: data.acceptanceStatus ? Date.now() : null,
          },
        },
      },
      { new: true }
    );
    risk = await this.Risks.populateRisk(risk);
    mainChannel.topic(SERVER_EVENTS.RISK_ACCEPTED).emit({
      accessControl: this.connection,
      risk,
    });

    // Clear cache
    await this.riskCache.clearAll();

    return risk;
  }

  async escalateRisk(id, data) {
    let risk = await this.getRisk({ _id: id });
    /**
     * risk can only be escalted if it's not mitigated or escalated.
     */
    if (
      this._checkIsActionAllowed(
        !this._isEscalated(risk) && !this._isMitigated(risk)
      )
    ) {
      risk = await this.Risks.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            escalated: {
              status: true,
              by: data.updatedBy._id,
              on: Date.now(),
            },
          },
        },
        { new: true }
      );
      risk = await this.Risks.populateRisk(risk);

      //notification
      mainChannel.topic(SERVER_EVENTS_BUS.ESCALATE_RISK_EVENT).emit({
        accessControl: this.connection,
        risk,
      });
      mainChannel.topic(SERVER_EVENTS.RISK_ESCALATED).emit({
        accessControl: this.connection,
        risk,
      });

      // Clear cache 
      await this.riskCache.clearAll();

      return risk;
    }
  }
  _isMitigated(risk) {
    return risk?.mitigated?.status;
  }
  _isAccepted(risk) {
    return risk?.accepted?.status;
  }
  _isEscalated(risk) {
    return risk?.escalated?.status;
  }
  _checkIsActionAllowed(logic) {
    if (logic) return true;
    throw new APIError(
      ReasonPhrases.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      "This action is not allowed on this risk."
    );
  }
  async deleteAttachment(id, attachment_id) {
    let risk = await this.Risks.findOneAndUpdate(
      { _id: id },
      {
        $pull: { attachments: { _id: attachment_id } },
      },
      { new: true }
    );
    return this.Risks.populateRisk(risk);
  }
  async riskSheet(query) {
    let risks = await this.Risks.findByOrg(
      this.connection?.user?.organizationId,
      query
    )
      .limit(100)
      .sort("-createdAt");
    risks = await Promise.all(
      risks.map((risk) => (risk = this.Risks.populateRisk(risk)))
    );
    let fileds = [
      { label: "Reference", value: "ID" },
      { label: "Business unit", value: "businessFunction" },
      { label: "Risks title", value: "risk" },
      { label: "Description", value: "description" },
      { label: "Likelyhood", value: "likelihood" },
      { label: "Consequence", value: "consequence" },
      { label: "Risk score", value: "score" },
      { label: "Controls and mitigation", value: "controlsAndMitigation" },
      { label: "Acceptance rationale", value: "acceptanceRational" },
      { label: "Decision maker", value: "decisionMaker" },
      { label: "Raised date", value: "raisedOn" },
      { label: "Mitigated date", value: "mitigatedOn" },
      { label: "Accepted date", value: "acceptedOn" },
      { label: "Escalated date", value: "escalatedOn" },
    ];
    let data = risks.map((risk) => ({
      ID: `RK-${risk.ID}`,
      businessFunction: risk.group.name,
      risk: risk.title,
      description: risk.description,
      likelihood: risk.score.likelihood.current,
      consequence: risk.score.consequence.current,
      score: risk.score.total.current,
      controlsAndMitigation: risk.controlsAndMitifation,
      acceptanceRational: risk.acceptanceRational,
      decisionMaker: risk.decisionMaker,
      raisedOn: moment(risk.created.on).format("D/M/Y"),
      mitigatedOn: risk.mitigated.status
        ? moment(risk.mitigated.on).format("D/M/Y")
        : "No date",
      acceptedOn: risk.accepted.status
        ? moment(risk.accepted.on).format("D/M/Y")
        : "No date",
      escalatedOn: risk.escalated.status
        ? moment(risk.escalated.on).format("D/M/Y")
        : "No date",
    }));
    return this.fileHandler.csvGenerator(fileds, data);
  }
  async linkISOControls(id, data) {
    let risk = await this.getRisk({ _id: id });
    if (this._checkIsActionAllowed(!this._isMitigated(risk))) {
      risk = await this.Risks.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            "isoControls.toolkits": data.toolkits,
          },
          $push: {
            "isoControls.clauses": data.controls,
          },
        },
        { new: true }
      );
      risk = await this.Risks.populateRisk(risk);
      mainChannel.topic(SERVER_EVENTS.CONTROL_HAS_BEEN_LINKED_TO_MODULE).emit({
        accessControl: this.connection,
        moduleType: moduleTypes.risks,
        module: risk,
        user: data.user,
        controls: data.controls,
      });
      return risk;
    }
  }
  async removeISOControls(id, data) {
    logger.info(data);
    let risk = await this.getRisk({ _id: id });
    if (this._checkIsActionAllowed(!this._isMitigated(risk))) {
      risk = await this.Risks.findOneAndUpdate(
        { _id: id },
        {
          $pullAll: {
            "isoControls.toolkits": data.toolkits,
          },
          $pullAll: {
            "isoControls.clauses": data.controls,
          },
        },
        { new: true }
      );
      risk = await this.Risks.populateRisk(risk);
      mainChannel
        .topic(SERVER_EVENTS.CONTROL_HAS_BEEN_UNLINKED_FROM_MODULE)
        .emit({
          accessControl: this.connection,
          moduleType: moduleTypes.risks,
          module: risk,
          user: data.user,
          controls: data.controls,
        });
      return risk;
    }
  }
}
exports.RiskManagementService = RiskManagementService;
