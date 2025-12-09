const { asyncWrapper, imsPaginationFormated } = require("./utility");
const CQCComplaintModel = require("../models/mongodb/system/cqc/cqcComplaint");
const CQCToolModel = require("../models/mongodb/system/cqc/cqcTool");
const CQCDetailModel = require("../models/mongodb/system/cqc/cqcDetails");
const CQCOverviewModel = require("../models/mongodb/system/cqc/cqcOverview");
const CQCReportModel = require("../models/mongodb/system/cqc/cqcReport");
const CQCWhistleBlowModel = require("../models/mongodb/system/cqc/cqcWhistleBlow");
const CQCSafeGuardingModel = require("../models/mongodb/system/cqc/cqcSafeGuarding");
const CQCSignificantEventModel = require("../models/mongodb/system/cqc/cqcSignificantEvent");
const IamGroupModel = require("../models/mongodb/system/ourIms/iamGroup");
const PolicyModel = require("../models/mongodb/system/ourIms/iamPolicy");
const IamRoleModel = require("../models/mongodb/system/ourIms/iamRole");
const { initialize } = require("../initialize/initIsoModule");
const UserModel = require("../models/mongodb/system/users&auth/user");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../email/sendMail");
const { pdfMaker } = require("../controllers/utils/pdfMaker");
const FileHandlerService = require("./fileHandler");
const moment = require("moment");
const AnalyticsService = require("./analytics");
const { IamPolicy } = require("./iamPolicy");
const {
  EFFECTS,
  IMS_POLICIES,
} = require("@ims-systems-00/ims-core/lib/constants");
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const Trigger = require("../services/triggers");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

class CQC extends FileHandlerService {
  constructor(connection) {
    super(connection);
    let analyticsService = new AnalyticsService(this.connection);
    this.connection = connection;
    this.Complaint = CQCComplaintModel(connection);
    this.CQCTool = CQCToolModel(connection);
    this.CQCDetail = CQCDetailModel(connection);
    this.CQCOverview = CQCOverviewModel(connection);
    this.CQCReport = CQCReportModel(connection);
    this.IamGroup = IamGroupModel(connection);
    this.User = UserModel(connection);
    this.CQCWhistleBlow = CQCWhistleBlowModel(connection);
    this.CQCSafeGuarding = CQCSafeGuardingModel(connection);
    this.CQCSignificantEvent = CQCSignificantEventModel(connection);
    this.analytics = analyticsService;
    this.Policy = PolicyModel(connection);
    this.IamRole = IamRoleModel(connection);
    this.trigger = new Trigger(connection);
  }
  async createCompliant(data) {
    let [compliant, compliantError] = await asyncWrapper(() =>
      this.Complaint.create({
        group: data.group,
        name: data.name,
        address: data.address,
        telephone: data.telephone,
        email: data.email,
        preferredCommunicationMethod: data.preferredCommunicationMethod,
        dateAndTimeOfIncident: data.dateAndTimeOfIncident,
        nameOfEmployee: data.nameOfEmployee,
        typeOfService: data.typeOfService,
        detail: data.detail,
        attachments: data.attachments,
        created: {
          by: data.createdBy,
          on: Date.now(),
        },
      })
    );
    if (compliantError) return [compliant, compliantError];
    this.analytics.analyzeCQCComplaints(data.group);
    return asyncWrapper(() => this.Complaint.populateCompliant(compliant));
  }
  async getCompliant(id) {
    let [compliant, compliantError] = await asyncWrapper(() =>
      this.Complaint.findOne({ _id: id })
    );
    if (compliantError) return [compliant, compliantError];
    return asyncWrapper(() => this.Complaint.populateCompliant(compliant));
  }
  async getCompliants(query, options) {
    let [pagination, compliantsError] = await asyncWrapper(() =>
      this.Complaint.paginate(query, options)
    );
    if (compliantsError) return [pagination, compliantsError];
    const compliants = pagination.docs;
    let [populatedComplaints, populationError] = await asyncWrapper(() =>
      Promise.all(
        compliants.map((compliant) =>
          this.Complaint.populateCompliant(compliant)
        )
      )
    );
    if (populationError) return [populatedComplaints, populationError];
    return [
      {
        compliants: populatedComplaints,
        pagination: imsPaginationFormated(pagination),
      },
      null,
    ];
  }
  async updateCompliant(id, data) {
    let [prevCompliant, prevCompliantError] = await asyncWrapper(() =>
      this.Complaint.findOne({ _id: id })
    );
    let [compliant, compliantError] = await asyncWrapper(() =>
      this.Complaint.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            group: data.group,
            name: data.name,
            address: data.address,
            telephone: data.telephone,
            email: data.email,
            preferredCommunicationMethod: data.preferredCommunicationMethod,
            dateAndTimeOfIncident: data.dateAndTimeOfIncident,
            nameOfEmployee: data.nameOfEmployee,
            typeOfService: data.typeOfService,
            detail: data.detail,
            investigator: data.investigator,
            investigation: data.investigation,
            actions: data.actions,
            outcome: data.outcome,
            nameOfOrganisation: data.nameOfOrganisation,
            referredToSomeoneElse: data.referredToSomeoneElse,
            referredInvestigator: data.referredInvestigator,
            referredActions: data.referredActions,
            referredOutcome: data.referredOutcome,
            "signed.status": data.signatureStatus,
            "signed.on": data.signatureStatus ? Date.now() : null,
            "signed.by": data.signatureStatus ? data.updatedBy : null,
          },
          $push: { attachments: data.attachments },
        },
        { new: true }
      )
    );
    if (data.signatureStatus) this.analytics.analyzeCQCComplaints(data.group);
    let [populatedComplaint, populatedCompliantError] = await asyncWrapper(() =>
      this.Complaint.populateCompliant(compliant)
    );
    if (
      (data.investigator && !prevCompliant.investigator) ||
      (data.investigator &&
        data.investigator.toString() !== prevCompliant.investigator.toString())
    ) {
      sendMail(
        "complaint-investigation",
        populatedComplaint.investigator.email,
        {
          name: populatedComplaint.investigator.name,
          by: populatedComplaint.created.by.name,
          complaint: `COM-${compliant.ID}`,
        }
      );
      this.trigger.sendNotification("complaintNewInvestigatorEvent", compliant);
    }
    if (
      (data.referredInvestigator && !prevCompliant.referredInvestigator) ||
      (data.referredInvestigator &&
        data.referredInvestigator.toString() !==
          prevCompliant.referredInvestigator.toString())
    ) {
      sendMail(
        "complaint-investigation",
        populatedComplaint.referredInvestigator.email,
        {
          name: populatedComplaint.referredInvestigator.name,
          by: populatedComplaint.created.by.name,
          complaint: `COM-${compliant.ID}`,
        }
      );
      this.trigger.sendNotification(
        "complaintReferredInvestigatorEvent",
        compliant
      );
    }
    if (compliantError) return [compliant, compliantError];
    return [populatedComplaint, populatedCompliantError];
  }
  async addAttachment(id, data) {
    return asyncWrapper(() =>
      this.Complaint.findOneAndUpdate(
        { _id: id },
        {
          $push: { attachments: data.attachments },
        },
        { new: true }
      )
    );
  }
  async deleteComplaintAttachment(id, attachment_id) {
    let [compliant, compliantError] = await asyncWrapper(() =>
      this.Complaint.findOneAndUpdate(
        { _id: id },
        {
          $pull: { attachments: { _id: attachment_id } },
        },
        { new: true }
      )
    );
    if (compliantError) return [compliant, compliantError];
    return asyncWrapper(() => this.Complaint.populateCompliant(compliant));
  }
  async deleteCompliant(id) {
    let [compliant, compliantError] = await asyncWrapper(() =>
      this.Complaint.findOneAndDelete({ _id: id })
    );
    if (compliant) this.analytics.analyzeCQCComplaints(compliant.group);
    return [compliant, compliantError];
  }
  async extractCompliants(query) {
    let [compliants, compliantsError] = await asyncWrapper(() =>
      this.Complaint.find(query).limit(30).sort("-createdAt")
    );
    if (compliantsError) return [compliants, compliantsError];
    let [populatedComplaints, populatedCompliantsError] = await asyncWrapper(
      () =>
        Promise.all(
          compliants.map((compliant) =>
            this.Complaint.populateCompliant(compliant)
          )
        )
    );
    if (populatedCompliantsError)
      return [populatedComplaints, populatedCompliantsError];
    let fileds = [
      { label: "Business unit", value: "group" },
      { label: "Name", value: "name" },
      { label: "Address", value: "address" },
      { label: "Telephone", value: "telephone" },
      {
        label: "Preferred communication method",
        value: "preferredCommunicationMethod",
      },
      { label: "Date of incident", value: "dateAndTimeOfIncident" },
      { label: "Name of employee", value: "nameOfEmployee" },
      { label: "Type of service", value: "typeOfService" },
      { label: "Detail", value: "detail" },
      { label: "Investigator", value: "investigator" },
      { label: "Investigation", value: "investigation" },
      { label: "Actions", value: "actions" },
      { label: "Outcome", value: "outcome" },
      { label: "Referred to", value: "referredInvestigator" },
      { label: "Actions", value: "referredActions" },
      { label: "Outcome", value: "referredOutcome" },
      { label: "Name of organisation", value: "nameOfOrganisation" },
      { label: "Signed off", value: "signedOff" },
      { label: "Signed date", value: "signedDate" },
      { label: "Signed by", value: "signedBy" },
    ];
    let data = populatedComplaints.map((data) => ({
      group: data.group ? data.group.name : "N/A",
      name: data.name,
      address: data.address,
      telephone: data.telephone,
      preferredCommunicationMethod: data.preferredCommunicationMethod,
      dateAndTimeOfIncident: moment(data.dateAndTimeOfIncident).format("D/M/Y"),
      nameOfEmployee: data.nameOfEmployee,
      typeOfService: data.typeOfService,
      detail: data.detail,
      investigator: data.investigator ? data.investigator.name : "Not assigned",
      investigation: data.investigation,
      actions: data.actions,
      outcome: data.outcome,
      referredInvestigator: data.referredInvestigator
        ? data.referredInvestigator.name
        : "Not assigned",
      referredActions: data.referredActions,
      referredOutcome: data.referredOutcome,
      nameOfOrganisation: data.nameOfOrganisation,
      signedOff: data.signed.status ? "Yes" : "No",
      signedDate: data.signed.status
        ? moment(data.signed.on).format("D/M/Y")
        : "No date",
      signedBy: data.signatureStatus ? data.signed.by.name : "N/A",
    }));
    let csv = this.csvGenerator(fileds, data);
    return [csv, null];
  }
  async buildCqcTool() {
    let [alreadyHave, alreadyhaveError] = await asyncWrapper(() =>
      this.CQCTool.find({})
    );
    if (alreadyHave.length)
      return [
        null,
        { message: "This tool already exists in this organisation" },
      ];
    if (alreadyhaveError)
      return [null, { message: "Tool request failed. server error" }];
    let [complianceModule, complianceModuleError] = await asyncWrapper(() =>
      initialize[IMS_SERVICES.CQC]()
    );
    if (complianceModuleError) return [complianceModule, complianceModuleError];
    let kloes = [];
    for (let module of complianceModule) {
      logger.info("Creating...", { clause: module.clause });
      let [kloe] = await asyncWrapper(() =>
        this.CQCTool.create({
          clause: module.clause,
          isLocked: module.isLocked,
          parentClause: module.parentControl,
          kloe: module.title,
          childrenClauses: module.childrenControls,
          description: module.description,
          appliesTo:
            module.moreInfo &&
            module.moreInfo.appliesTo &&
            module.moreInfo.appliesTo,
        })
      );
      kloes.push(kloe);
    }
    return [kloes, null];
  }
  async grantToolAccess(group) {
    let [alreadyHaveTool, alreadyhaveToolError] = await asyncWrapper(() =>
      this.CQCDetail.find({ group })
    );
    let [alreadyHaveOverview, alreadyHaveOverviewError] = await asyncWrapper(
      () => this.CQCOverview.find({ group })
    );
    if (alreadyHaveTool.length || alreadyHaveOverview.length)
      return [null, { message: "This tool already exists in this unit" }];
    if (alreadyhaveToolError || alreadyHaveOverviewError)
      return [null, { message: "Tool request failed. server error." }];
    let [toolRefrence] = await asyncWrapper(() => this.CQCTool.find({}));
    let [cqcOverview, cqcOverviewError] = await asyncWrapper(() =>
      this.CQCOverview.create({ group })
    );
    if (cqcOverviewError) return [cqcOverview, cqcOverviewError];
    let controls = [];
    for (let control of toolRefrence) {
      logger.info("Creating...", { clause: control.clause });
      let [kloe] = await asyncWrapper(() =>
        this.CQCDetail.create({
          group,
          control: control._id,
        })
      );
      controls.push(kloe);
    }
    let policyService = new IamPolicy(this.connection);
    let [policies, policiesError] = await asyncWrapper(() =>
      policyService.grantComlianceToolAccess(group, IMS_SERVICES.CQC)
    );
    if (policiesError) return [policies, policiesError];
    return asyncWrapper(() =>
      this.CQCOverview.populateCQCOverview(cqcOverview)
    );
  }
  async revokeToolAccess(group) {
    let [cqcOverview, cqcOverviewError] = await asyncWrapper(() =>
      this.CQCOverview.findOneAndDelete({ group })
    );
    if (cqcOverviewError)
      return [null, { message: "CQC tool overview delete failed" }];
    let policyService = new IamPolicy(this.connection);
    let [users, usersError] = await asyncWrapper(() =>
      this.User.find({ "accessPolicies.group": group })
        .select({ accessPolicies: { $elemMatch: { group } } })
        .populate([])
        .exec()
    );
    let [policies, policiesError] = await asyncWrapper(() =>
      Promise.all(
        users.map((user) =>
          this.Policy.findOne({ _id: user.accessPolicies[0].role.policy })
        )
      )
    );
    logger.info(users);
    logger.info(policies);
    let [updatedPolicies, updatedPoliciesError] = await asyncWrapper(() =>
      Promise.all(
        policies.map((policy) =>
          policyService.greantCqcAccess(policy._id, EFFECTS.BLOCK)
        )
      )
    );
    return asyncWrapper(() =>
      this.CQCDetail.deleteMany({
        group,
      })
    );
  }
  async getCqcTool(query, options) {
    let search = query.$or ? { $or: query.$or } : {};
    let clauseMatch = query.clause
      ? { clause: query.clause, ...search }
      : { ...search };
    let [controlRefs, refError] = await asyncWrapper(() =>
      this.CQCTool.find(clauseMatch)
    );
    if (refError) return [controlRefs, refError];
    controlRefs = controlRefs.map((control) => control._id);
    const [pagination, paginationError] = await asyncWrapper(() =>
      this.CQCDetail.paginate(
        { group: query.group, control: { $in: controlRefs } },
        options
      )
    );
    if (paginationError) return [pagination, paginationError];
    let controls = pagination.docs;
    let [populatedControls, populationError] = await asyncWrapper(() =>
      Promise.all(
        controls.map((control) => this.CQCDetail.populateCQCDetail(control))
      )
    );
    if (populationError) return [pagination, paginationError];
    return [
      {
        controls: populatedControls,
        pagination: imsPaginationFormated(pagination),
      },
      null,
    ];
  }
  async getCqcOverview(group) {
    let [cqcOverview, cqcOverviewError] = await asyncWrapper(() =>
      this.CQCOverview.findOne({ group })
    );
    if (cqcOverviewError) return [cqcOverview, cqcOverviewError];
    return asyncWrapper(() =>
      this.CQCOverview.populateCQCOverview(cqcOverview)
    );
  }
  async getCqcOverviews(query, options) {
    let [pagination, cqcOverviewsError] = await asyncWrapper(() =>
      this.CQCOverview.paginate(query, options)
    );
    if (cqcOverviewsError) return [pagination, cqcOverviewsError];
    let cqcOverviews = pagination.docs;
    let [populatedOverviews, populationError] = await asyncWrapper(() =>
      Promise.all(
        cqcOverviews.map((cqcOverview) =>
          this.CQCOverview.populateCQCOverview(cqcOverview)
        )
      )
    );
    if (populationError) return [populatedOverviews, populationError];
    return [
      {
        overviews: populatedOverviews,
        pagination: imsPaginationFormated(pagination),
      },
      null,
    ];
  }
  async updateCqcRating(group, data) {
    let [cqcOverview, cqcOverviewError] = await asyncWrapper(() =>
      this.CQCOverview.findOneAndUpdate(
        { group },
        {
          $set: {
            "safe.rating": data.safe,
            "effective.rating": data.effective,
            "caring.rating": data.caring,
            "responsive.rating": data.responsive,
            "wellLed.rating": data.wellLed,
            "overall.rating": data.overall,
          },
        },
        { new: true }
      )
    );
    if (cqcOverviewError) return [cqcOverview, cqcOverviewError];
    return asyncWrapper(() =>
      this.CQCOverview.populateCQCOverview(cqcOverview)
    );
  }
  async getControl(id) {
    return asyncWrapper(() =>
      this.CQCDetail.findOne({ _id: id })
        .populate([
          { path: "evidences.created.by", model: this.User, select: "name" },
          { path: "group", model: this.IamGroup, select: "name" },
          {
            path: "control",
            model: this.CQCTool,
            select: "-createdAt -updatedAt",
          },
        ])
        .exec()
    );
  }
  async updateKloe(group, data) {
    let { adopted, clause } = data;
    let [kloes, kloesError] = await asyncWrapper(() =>
      this.CQCDetail.find({ group })
        .populate([{ path: "control", model: this.CQCTool }])
        .exec()
    );
    if (kloesError) return [kloes, kloesError];
    this._calculateCompliance(clause, adopted, kloes);
    // update overall dashboard for the section...
    this._calculateOverAllCompliance(clause, group, kloes);
    // update overall dashboard for the section...
    this._calculateOverAllCompliance(null, group, kloes);
    return asyncWrapper(() =>
      Promise.all(
        kloes.map((kloe) =>
          this.CQCDetail.findOneAndUpdate(
            { _id: kloe._id },
            {
              $set: {
                compliancePercentage: kloe.compliancePercentage,
                adopted: kloe.adopted,
                numberOfCompliantChildren: kloe.numberOfCompliantChildren,
              },
            },
            { new: true }
          )
        )
      )
    );
  }
  async _calculateOverAllCompliance(clause, group, kloes) {
    let section = clause ? clause[0] : null;
    let roots = clause
      ? kloes.filter(
          (kloe) =>
            !kloe.control.isLocked && kloe.control.clause[0] === clause[0]
        )
      : kloes.filter((kloe) => !kloe.control.isLocked);
    let targetCompliance = roots.length * 100;
    let complianceAchived = roots.reduce(
      (total, current) => total + current.compliancePercentage,
      0
    );
    let totalPercentage = Math.round(
      (complianceAchived / targetCompliance) * 100
    );
    let query = {};
    switch (section) {
      case "S": {
        query = { "safe.compliancePercentage": totalPercentage };
        break;
      }
      case "E": {
        query = { "effective.compliancePercentage": totalPercentage };
        break;
      }
      case "R": {
        query = { "responsive.compliancePercentage": totalPercentage };
        break;
      }
      case "C": {
        query = { "caring.compliancePercentage": totalPercentage };
        break;
      }
      case "W": {
        query = { "wellLed.compliancePercentage": totalPercentage };
        break;
      }
      default: {
        query = { "overall.compliancePercentage": totalPercentage };
      }
    }
    await asyncWrapper(() =>
      this.CQCOverview.findOneAndUpdate(
        { group },
        {
          $set: query,
        },
        { new: true }
      )
    );
  }
  _calculateCompliance(clause, adopted, KLOEs) {
    let kloe = KLOEs.find((kloe) => kloe.control.clause === clause);
    let parentClause = kloe.control.parentClause;
    let parentKloe = KLOEs.find((kloe) => kloe.control.clause === parentClause);
    // logger.info("Current  : " + Clause + "  " + "parent : " + parentClause, "  Compliance :" + isCompliant, parentModule)
    if (!kloe.control.parentClause) {
      kloe.adopted = adopted;
      if (kloe.adopted === "Yes") {
        kloe.compliancePercentage = 100;
      }
    }
    if (
      (!kloe.control.isLocked && kloe.adopted !== adopted) ||
      (kloe.control.isLocked && kloe.adopted !== adopted)
    ) {
      kloe.adopted = adopted;
      if (kloe.adopted === "Yes") {
        kloe.compliancePercentage = 100;
      } else {
        kloe.compliancePercentage = kloe.control.childrenClauses.length
          ? Math.round(
              (kloe.numberOfCompliantChildren /
                kloe.control.childrenClauses.length) *
                100
            )
          : 0;
      }
      if (kloe.adopted === "Yes") {
        parentKloe.numberOfCompliantChildren += 1;
      } else {
        parentKloe.numberOfCompliantChildren -= 1;
      }
      if (
        parentKloe.numberOfCompliantChildren ===
          parentKloe.control.childrenClauses.length &&
        kloe.control.parentClause
      ) {
        this._calculateCompliance(parentKloe.control.clause, "Yes", KLOEs);
      } else {
        parentKloe.compliancePercentage = Math.round(
          (parentKloe.numberOfCompliantChildren /
            parentKloe.control.childrenClauses.length) *
            100
        );
        this._calculateCompliance(parentKloe.control.clause, "No", KLOEs);
      }
    }
  }
  async addEvidence(id, data) {
    let [control, controlError] = await asyncWrapper(() =>
      this.CQCDetail.findOneAndUpdate(
        { _id: id },
        {
          $push: { evidences: data.evidences },
        },
        { new: true }
      )
    );
    if (controlError) return [control, controlError];
    return asyncWrapper(() => this.CQCDetail.populateCQCDetail(control));
  }
  async deleteEvidence(id, evidence_id) {
    let [control, controlError] = await asyncWrapper(() =>
      this.CQCDetail.findOneAndUpdate(
        { _id: id },
        {
          $pull: { evidences: { _id: evidence_id } },
        },
        { new: true }
      )
    );
    if (controlError) return [control, controlError];
    return asyncWrapper(() => this.CQCDetail.populateCQCDetail(control));
  }
  async addComment(id, data) {
    let [control, controlError] = await asyncWrapper(() =>
      this.CQCDetail.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            comments: {
              $each: [
                {
                  value: data.value,
                  created: {
                    by: data.createdBy,
                    on: Date.now(),
                  },
                },
              ],
              $position: 0,
            },
          },
        },
        { new: true }
      )
    );
    if (controlError) return [control, controlError];
    return asyncWrapper(() => this.CQCDetail.populateCQCDetail(control));
  }
  async updateComment(id, comment_id, data) {
    let [control, controlError] = await asyncWrapper(() =>
      this.CQCDetail.findOneAndUpdate(
        { "comments._id": comment_id },
        {
          $set: {
            "comments.$.value": data.value,
          },
        },
        { new: true }
      )
    );
    if (controlError) return [control, controlError];
    return asyncWrapper(() => this.CQCDetail.populateCQCDetail(control));
  }
  async deleteComment(id, comment_id) {
    let [control, controlError] = await asyncWrapper(() =>
      this.CQCDetail.findOneAndUpdate(
        { _id: id },
        {
          $pull: { comments: { _id: comment_id } },
        },
        { new: true }
      )
    );
    if (controlError) return [control, controlError];
    return asyncWrapper(() => this.CQCDetail.populateCQCDetail(control));
  }
  async createCQCReport(data) {
    let [cqcOverview, cqcOverviewError] = await asyncWrapper(() =>
      this.CQCOverview.findOne({ group: data.group })
    );
    if (cqcOverviewError) return [cqcOverview, cqcOverviewError];
    let [cqcReport, cqcReportError] = await asyncWrapper(() =>
      this.CQCReport.create({
        group: data.group,
        personName: data.personName,
        email: data.email,
        message: data.message,
        safe: {
          rating: cqcOverview.safe.rating,
          compliancePercentage: cqcOverview.safe.compliancePercentage,
        },
        effective: {
          rating: cqcOverview.effective.rating,
          compliancePercentage: cqcOverview.effective.compliancePercentage,
        },
        caring: {
          rating: cqcOverview.caring.rating,
          compliancePercentage: cqcOverview.caring.compliancePercentage,
        },
        responsive: {
          rating: cqcOverview.responsive.rating,
          compliancePercentage: cqcOverview.responsive.compliancePercentage,
        },
        wellLed: {
          rating: cqcOverview.wellLed.rating,
          compliancePercentage: cqcOverview.wellLed.compliancePercentage,
        },
        overall: {
          rating: cqcOverview.overall.rating,
          compliancePercentage: cqcOverview.overall.compliancePercentage,
        },
        complaints: {
          open: cqcOverview.complaints.open,
          signedOff: cqcOverview.complaints.signedOff,
        },
        whistleBlows: {
          open: cqcOverview.whistleBlows.open,
          signedOff: cqcOverview.whistleBlows.open,
        },
        significantEvents: {
          open: cqcOverview.significantEvents.open,
          signedOff: cqcOverview.significantEvents.open,
        },
        safeGuardings: {
          open: cqcOverview.safeGuardings.open,
          signedOff: cqcOverview.safeGuardings.open,
        },
        attachments: data.attachments,
        created: {
          by: data.createdBy,
          on: Date.now(),
        },
      })
    );
    let [populatedCqcReport, populatedCqcReportError] = await asyncWrapper(() =>
      this.CQCReport.populateCQCReport(cqcReport)
    );
    if (cqcReportError) return [cqcReport, cqcReportError];
    if (cqcReportError) return [populatedCqcReport, populatedCqcReportError];
    this._buildAndSendReport(populatedCqcReport);
    return [populatedCqcReport, populatedCqcReportError];
  }
  async resendCQCReport(id) {
    let [cqcReport, cqcReportError] = await asyncWrapper(() =>
      this.CQCReport.findOne({ _id: id })
    );
    if (cqcReportError) return [cqcReport, cqcReportError];
    let [populatedCqcReport, populatedReportError] = await asyncWrapper(() =>
      this.CQCReport.populateCQCReport(cqcReport)
    );
    if (populatedReportError) return [populatedCqcReport, populatedReportError];
    this._buildAndSendReport(populatedCqcReport);
    return [populatedCqcReport, populatedReportError];
  }
  async _buildAndSendReport(data) {
    let report = require("./reportTemplates/cqcReport")(data);
    let fileName = `CQCReport-${uuidv4()}.pdf`;
    let document = {
      html: report,
      fileName,
      data: {},
      path: `./temp/${fileName}`,
      type: "",
    };
    let [pdf, padfMakerError] = await asyncWrapper(() => pdfMaker(document));
    if (padfMakerError) return [pdf, padfMakerError];
    let files = [];
    files = [document, ...files];
    await asyncWrapper(() =>
      sendMail("cqc-report", data.email, {
        reciever: data.personName,
        sender: data.created.by.name,
        group: data.group,
        message: data.message,
        attachments: files.map((file) => ({
          filename: file.fileName,
          path: file.path,
        })),
      })
    );
    files.map((file) => this.removeTemporary(file));
  }

  async getCQCReports(query, options) {
    let [pagination, cqcReportsError] = await asyncWrapper(() =>
      this.CQCReport.paginate(query, options)
    );
    if (cqcReportsError) return [pagination, cqcReportsError];
    let cqcReports = pagination.docs;
    let [populatedReports, populationError] = await asyncWrapper(() =>
      Promise.all(
        cqcReports.map((cqcReport) =>
          this.CQCReport.populateCQCReport(cqcReport)
        )
      )
    );
    if (populationError) return [populatedReports, populationError];
    return [
      {
        reports: populatedReports,
        pagination: imsPaginationFormated(pagination),
      },
      null,
    ];
  }
  async getCQCReport(id) {
    let [cqcReport, cqcReportError] = await asyncWrapper(() =>
      this.CQCReport.findOne({ _id: id })
    );
    if (cqcReportError) return [cqcReport, cqcReportError];
    return asyncWrapper(() => this.CQCReport.populateCQCReport(cqcReport));
  }
  async deleteCQCReport(id) {
    return asyncWrapper(() => this.CQCReport.findOneAndDelete({ _id: id }));
  }
  async createCQCWhistleBlow(data) {
    let [whistleBlow, whistleBlowError] = await asyncWrapper(() =>
      this.CQCWhistleBlow.create({
        group: data.group,
        reportedTo: data.reportedTo,
        dateOfIncident: data.dateOfIncident,
        title: data.title,
        description: data.description,
        placeOfIncident: data.placeOfIncident,
        involvedPersonnel: data.involvedPersonnel,
        opinion: data.opinion,
        identity: data.identity,
        "statementOfDisclosureOne.status": data.statementOfDisclosureOne,
        "statementOfDisclosureTwo.status": data.statementOfDisclosureTwo,
        "statementOfDisclosureThree.status": data.statementOfDisclosureThree,
        created: {
          on: Date.now(),
          by: data.createdBy,
        },
      })
    );

    if (whistleBlowError) return [whistleBlow, whistleBlowError];
    this.analytics.analyzeCQCWhistleBlows(data.group);
    let [populatedwhistleblow, populatedwhistleblowsError] = await asyncWrapper(
      () => this.CQCWhistleBlow.populateCQCWhistleblow(whistleBlow)
    );
    if (populatedwhistleblow)
      this.trigger.sendNotification(
        "newWhistleBlowInvestigatorEvent",
        populatedwhistleblow
      );
    return [populatedwhistleblow, populatedwhistleblowsError];
  }
  async updateCQCWhistleBlow(id, data) {
    let [whistleBlow, whistleBlowError] = await asyncWrapper(() =>
      this.CQCWhistleBlow.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            group: data.group,
            reportedTo: data.reportedTo,
            dateOfIncident: data.dateOfIncident,
            title: data.title,
            description: data.description,
            placeOfIncident: data.placeOfIncident,
            involvedPersonnel: data.involvedPersonnel,
            sharedWith: data.sharedWith,
            opinion: data.opinion,
            identity: data.identity,
            "signed.status": data.signatureStatus,
            "signed.on": data.signatureStatus ? Date.now() : null,
            "signed.by": data.signatureStatus ? data.updatedBy : null,
          },
        },
        { new: true }
      )
    );
    if (whistleBlowError) return [whistleBlow, whistleBlowError];
    if (data.signatureStatus) this.analytics.analyzeCQCWhistleBlows(data.group);
    return asyncWrapper(() =>
      this.CQCWhistleBlow.populateCQCWhistleblow(whistleBlow)
    );
  }
  async getCQCWhistleBlows(query, options) {
    let [pagination, whistleBlowsError] = await asyncWrapper(() =>
      this.CQCWhistleBlow.paginate(query, options)
    );
    if (whistleBlowsError) return [pagination, whistleBlowsError];
    let whistleBlows = pagination.docs;
    let [populatedWhistleBlows, populationError] = await asyncWrapper(() =>
      Promise.all(
        whistleBlows.map((whistleBlow) =>
          this.CQCWhistleBlow.populateCQCWhistleblow(whistleBlow)
        )
      )
    );
    if (populationError) return [populatedWhistleBlows, populationError];
    return [
      {
        whistleBlows: populatedWhistleBlows,
        pagination: imsPaginationFormated(pagination),
      },
      null,
    ];
  }
  async getCQCWhistleBlow(id) {
    let [whistleBlow, whistleBlowError] = await asyncWrapper(() =>
      this.CQCWhistleBlow.findOne({ _id: id })
    );
    if (whistleBlowError) return [whistleBlow, whistleBlowError];
    return asyncWrapper(() =>
      this.CQCWhistleBlow.populateCQCWhistleblow(whistleBlow)
    );
  }
  async deleteCQCWhistleBlow(id) {
    let [whistleBlow, whistleBlowError] = await asyncWrapper(() =>
      this.CQCWhistleBlow.findOneAndDelete({ _id: id })
    );
    if (whistleBlow) this.analytics.analyzeCQCWhistleBlows(whistleBlow.group);
    return [whistleBlow, whistleBlowError];
  }
  async extractWistleBlows(query) {
    let [whistleBlows, whistleBlowsError] = await asyncWrapper(() =>
      this.CQCWhistleBlow.find(query).sort("-createdAt")
    );
    if (whistleBlowsError) return [whistleBlows, whistleBlowsError];

    let [populatedWhistleBlows, populatedWhistleBlowsError] =
      await asyncWrapper(() =>
        Promise.all(
          whistleBlows.map((whistleBlow) =>
            this.CQCWhistleBlow.populateCQCWhistleblow(whistleBlow)
          )
        )
      );
    if (populatedWhistleBlowsError)
      return [populatedWhistleBlows, populatedWhistleBlowsError];
    let fileds = [
      { label: "Business unit", value: "group" },
      { label: "Reported to", value: "reportedTo" },
      { label: "Date of incident", value: "dateOfIncident" },
      { label: "Description", value: "description" },
      { label: "Place of incident", value: "placeOfIncident" },
      { label: "People involved", value: "involvedPersonnel" },
      { label: "Opinion", value: "opinion" },
      { label: "Identitiy", value: "identity" },
      { label: "Signed off", value: "signedOff" },
      { label: "Signed date", value: "signedDate" },
      { label: "Signed by", value: "signedBy" },
    ];
    let data = populatedWhistleBlows.map((data) => ({
      group: data.group.name,
      reportedTo: data.reportedTo.name,
      dateOfIncident: moment(data.dateOfIncident).format("D/M/Y"),
      description: data.description,
      placeOfIncident: data.placeOfIncident,
      involvedPersonnel: data.involvedPersonnel
        .map((user) => user.name)
        .join(","),
      opinion: data.opinion,
      identity: data.identity,
      signedOff: data.signed.status ? "Yes" : "NO",
      signedDate: data.signed.status
        ? moment(data.signed.on).format("D/M/Y")
        : "No date",
      signedBy: data.signatureStatus ? data.signed.by.name : "N/A",
    }));
    let csv = this.csvGenerator(fileds, data);
    return [csv, null];
  }
  async createCQCSafeGuarding(data) {
    let [safeGuarding, safeGuardingError] = await asyncWrapper(() =>
      this.CQCSafeGuarding.create({
        group: data.group,
        personAffected: data.personAffected,
        riskRegistar: data.riskRegistar,
        summaryOfConcerns: data.summaryOfConcerns,
        agenciesInvolved: data.agenciesInvolved,
        investigation: data.investigation,
        outcome: data.outcome,
        attachments: data.attachments,
        sharedWith: data.sharedWith,
        created: {
          on: Date.now(),
          by: data.createdBy,
        },
      })
    );
    if (safeGuardingError) return [safeGuarding, safeGuardingError];
    this.analytics.analyzeCQCSafeguardings(data.group);
    return asyncWrapper(() =>
      this.CQCSafeGuarding.populateCQCSafeGuarding(safeGuarding)
    );
  }
  async updateCQCSafeGuarding(id, data) {
    let [safeGuarding, safeGuardingError] = await asyncWrapper(() =>
      this.CQCSafeGuarding.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            group: data.group,
            personAffected: data.personAffected,
            riskRegistar: data.riskRegistar,
            summaryOfConcerns: data.summaryOfConcerns,
            agenciesInvolved: data.agenciesInvolved,
            "referred.status": data.referredStatus,
            "referred.to": data.referredTo,
            "referred.email":
              data.referredEmail && data.referredEmail.toLowerCase(),
            "referred.nameOfOrganisation": data.nameOfOrganisation,
            "referred.rational": data.rational,
            sharedWith: data.sharedWith,
            investigation: data.investigation,
            outcome: data.outcome,
            "signed.status": data.signatureStatus,
            "signed.on": data.signatureStatus ? Date.now() : null,
            "signed.by": data.signatureStatus ? data.updatedBy : null,
          },
          $push: {
            attachments: data.attachments,
          },
        },
        { new: true }
      )
    );
    if (safeGuardingError) return [safeGuarding, safeGuardingError];
    if (data.signatureStatus)
      this.analytics.analyzeCQCSafeguardings(data.group);
    let [populatedSafeguarding, populatedSafeguardingError] =
      await asyncWrapper(() =>
        this.CQCSafeGuarding.populateCQCSafeGuarding(safeGuarding)
      );
    if (populatedSafeguarding && data.sendReferral)
      this._buildAndReferSafeGuarding(populatedSafeguarding);
    return [populatedSafeguarding, populatedSafeguardingError];
  }
  async _buildAndReferSafeGuarding(data) {
    logger.info(data);
    let report = require("./reportTemplates/cqcSafeGuarding")(data);
    let date = new Date();
    let fileName = `Safeguarding-${data.ID}-${date.toDateString()}.pdf`;
    let document = {
      html: report,
      fileName,
      data: {},
      path: `./temp/${fileName}`,
      type: "",
    };
    let [pdf, padfMakerError] = await asyncWrapper(() => pdfMaker(document));
    if (padfMakerError) return [pdf, padfMakerError];
    let files = [];
    files = [document, ...files];
    await asyncWrapper(() =>
      sendMail("cqc-safeguarding-refered", data.referred.email, {
        reciever: data.referred.to,
        sender: data.created.by.name,
        ID: data.ID,
        attachments: files.map((file) => ({
          filename: file.fileName,
          path: file.path,
        })),
      })
    );
    logger.info("Send successful !");
    files.map((file) => this.removeTemporary(file));
  }
  async removeCQCSafeGuardingAttachment(id, attachment_id) {
    let [safeGuarding, safeGuardingError] = await asyncWrapper(() =>
      this.CQCSafeGuarding.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            attachments: { _id: attachment_id },
          },
        },
        { new: true }
      )
    );
    if (safeGuardingError) return [safeGuarding, safeGuardingError];
    return asyncWrapper(() =>
      this.CQCSafeGuarding.populateCQCSafeGuarding(safeGuarding)
    );
  }
  async getCQCSafeGuardings(query, options) {
    let [pagination, safeGuardingsError] = await asyncWrapper(() =>
      this.CQCSafeGuarding.paginate(query, options)
    );
    if (safeGuardingsError) return [safeGuardings, safeGuardingsError];
    let safeGuardings = pagination.docs;
    let [populatedSafeGuardings, populationError] = await asyncWrapper(() =>
      Promise.all(
        safeGuardings.map((safeGuarding) =>
          this.CQCSafeGuarding.populateCQCSafeGuarding(safeGuarding)
        )
      )
    );
    if (populationError) return [populatedSafeGuardings, populationError];
    return [
      {
        safeGuardings: populatedSafeGuardings,
        pagination: imsPaginationFormated(pagination),
      },
      null,
    ];
  }
  async getCQCSafeGuarding(id) {
    let [safeGuarding, safeGuardingError] = await asyncWrapper(() =>
      this.CQCSafeGuarding.findOne({ _id: id })
    );
    if (safeGuardingError) return [safeGuarding, safeGuardingError];
    return asyncWrapper(() =>
      this.CQCSafeGuarding.populateCQCSafeGuarding(safeGuarding)
    );
  }
  async deleteCQCSafeGuarding(id) {
    let [safeGuarding, safeGuardingError] = await asyncWrapper(() =>
      this.CQCSafeGuarding.findOneAndDelete({ _id: id })
    );
    if (safeGuarding)
      this.analytics.analyzeCQCSafeguardings(safeGuarding.group);
    return [safeGuarding, safeGuardingError];
  }
  async extractSafeGuardings(query) {
    let [safeGuardings, safeGuardingsError] = await asyncWrapper(() =>
      this.CQCSafeGuarding.find(query).sort("-createdAt")
    );
    if (safeGuardingsError) return [safeGuardings, safeGuardingsError];
    let [populatedSafeGuardings, populatedSafeGuardingsError] =
      await asyncWrapper(() =>
        Promise.all(
          safeGuardings.map((safeGuarding) =>
            this.CQCSafeGuarding.populateCQCSafeGuarding(safeGuarding)
          )
        )
      );
    if (populatedSafeGuardingsError)
      return [populatedSafeGuardings, populatedSafeGuardingsError];

    let fileds = [
      { label: "Business unit", value: "group" },
      { label: "Reported to", value: "personAffected" },
      { label: "Date of incident", value: "riskRegistar" },
      { label: "Description", value: "summaryOfConcerns" },
      { label: "Place of incident", value: "agenciesInvolved" },
      { label: "People involved", value: "referrals" },
      { label: "Opinion", value: "investigation" },
      { label: "Identitiy", value: "outcome" },
      { label: "Signed off", value: "signedOff" },
      { label: "Signed date", value: "signedDate" },
      { label: "Signed by", value: "signedBy" },
    ];
    let data = populatedWhistleBlows.map((data) => ({
      group: data.group.name,
      personAffected: data.personAffected.name,
      riskRegistar: data.riskRegistar,
      summaryOfConcerns: data.summaryOfConcerns,
      agenciesInvolved: data.agenciesInvolved,
      referrals: data.referrals,
      investigation: data.investigation,
      outcome: data.outcome,
      signedOff: data.signed.status ? "Yes" : "NO",
      signedDate: data.signed.status
        ? moment(data.signed.on).format("D/M/Y")
        : "No date",
      signedBy: data.signatureStatus ? data.signed.by.name : "N/A",
    }));
    let csv = this.csvGenerator(fileds, data);
    return [csv, null];
  }
  async createCQCSignificantEvent(data) {
    let [significantEvent, significantEventError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.create({
        group: data.group,
        dateOfEvent: data.dateOfEvent,
        title: data.title,
        description: data.description,
        dateOfReviewMeeting: data.dateOfReviewMeeting,
        presentPersonnel: data.presentPersonnel,
        positivePoints: data.positivePoints,
        attachments: data.attachments,
        keyIssues: data.keyIssues,
        areasOfConcern: data.areasOfConcern,
        created: {
          on: Date.now(),
          by: data.createdBy,
        },
      })
    );
    if (significantEventError) return [significantEvent, significantEventError];
    this.analytics.analyzeCQCSignificantEvents(data.group);
    return asyncWrapper(() =>
      this.CQCSignificantEvent.populateCQCSignificantEvent(significantEvent)
    );
  }
  async updateCQCSignificantEvent(id, data) {
    let [significantEvent, significantEventError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            group: data.group,
            dateOfEvent: data.dateOfEvent,
            title: data.title,
            description: data.description,
            dateOfReviewMeeting: data.dateOfReviewMeeting,
            presentPersonnel: data.presentPersonnel,
            positivePoints: data.positivePoints,
            keyIssues: data.keyIssues,
            areasOfConcern: data.areasOfConcern,
            "signed.status": data.signatureStatus,
            "signed.on": data.signatureStatus ? Date.now() : null,
            "signed.by": data.signatureStatus ? data.updatedBy : null,
          },
          $push: { attachments: data.attachments },
        },
        { new: true }
      )
    );
    if (significantEventError) return [significantEvent, significantEventError];
    if (data.signatureStatus)
      this.analytics.analyzeCQCSignificantEvents(data.group);
    return asyncWrapper(() =>
      this.CQCSignificantEvent.populateCQCSignificantEvent(significantEvent)
    );
  }
  async removeCQCSignificantEventAttachment(id, attachment_id) {
    let [significantEvent, significantEventError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.findOneAndUpdate(
        { _id: id },
        {
          $pull: { attachments: { _id: attachment_id } },
        },
        { new: true }
      )
    );
    if (significantEventError) return [significantEvent, significantEventError];
    return asyncWrapper(() =>
      this.CQCSignificantEvent.populateCQCSignificantEvent(significantEvent)
    );
  }
  async getCQCSignificantEvents(query, options) {
    let [pagination, significantEventsError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.paginate(query, options)
    );
    if (significantEventsError)
      return [significantEvents, significantEventsError];
    let significantEvents = pagination.docs;
    let [populatedSignificantEvents, populationError] = await asyncWrapper(() =>
      Promise.all(
        significantEvents.map((significantEvent) =>
          this.CQCSignificantEvent.populateCQCSignificantEvent(significantEvent)
        )
      )
    );
    if (populationError) return [populatedSignificantEvents, populationError];
    return [
      {
        significantEvents: populatedSignificantEvents,
        pagination: imsPaginationFormated(pagination),
      },
      null,
    ];
  }
  async getCQCSignificantEvent(id) {
    let [significantEvent, significantEventError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.findOne({ _id: id })
    );
    if (significantEventError) return [significantEvent, significantEventError];
    return asyncWrapper(() =>
      this.CQCSignificantEvent.populateCQCSignificantEvent(significantEvent)
    );
  }
  async deleteCQCSignificantEvent(id) {
    let [significantEvent, significantEventError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.findOneAndDelete({ _id: id })
    );
    if (significantEvent)
      this.analytics.analyzeCQCSignificantEvents(significantEvent.group);
    return [significantEvent, significantEventError];
  }
  async extractSignificantEvent(query) {
    let [significantEvents, significantEventsError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.find(query).sort("-createdAt")
    );
    if (significantEventsError)
      return [significantEvents, significantEventsError];
    let [populatedSignificantEvents, populatedSignificantEventsError] =
      await asyncWrapper(() =>
        Promise.all(
          significantEvents.map((significantEvent) =>
            this.CQCSignificantEvent.populateCQCSignificantEvent(
              significantEvent
            )
          )
        )
      );
    if (populatedSignificantEventsError)
      return [populatedSignificantEvents, populatedSignificantEventsError];

    let fileds = [
      { label: "Business unit", value: "group" },
      { label: "Signed off", value: "signedOff" },
      { label: "Signed date", value: "signedDate" },
      { label: "Signed by", value: "signedBy" },
    ];
    let data = populatedSignificantEvents.map((data) => ({
      group: data.group.name,

      signedOff: data.signed.status ? "Yes" : "NO",
      signedDate: data.signed.status
        ? moment(data.signed.on).format("D/M/Y")
        : "No date",
      signedBy: data.signatureStatus ? data.signed.by.name : "N/A",
    }));
    let csv = this.csvGenerator(fileds, data);
    return [csv, null];
  }

  async addSignificantEventAction(id, data) {
    let [significantEvent, significantEventError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            planOfActions: {
              $each: [
                {
                  value: data.value,
                  assigned: {
                    to: data.assignedTo,
                    on: Date.now(),
                  },
                  created: {
                    by: data.createdBy,
                    on: Date.now(),
                  },
                },
              ],
              $position: 0,
            },
          },
        },
        { new: true }
      )
    );
    if (significantEventError) return [significantEvent, significantEventError];

    let [populatedsignificantEvent, populatedsignificantEventError] =
      await asyncWrapper(() =>
        this.CQCSignificantEvent.populateCQCSignificantEvent(significantEvent)
      );
    populatedsignificantEvent &&
      this.trigger.sendNotification(
        "significanteventPlaneOfActionAssignedEvent",
        {
          ...populatedsignificantEvent._doc,
          request: {
            ...data,
          },
        }
      );
    return [populatedsignificantEvent, populatedsignificantEventError];
  }
  async updateSignificantEventAction(id, action_id, data) {
    let [significantEvent, significantEventError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.findOneAndUpdate(
        { "planOfActions._id": action_id },
        {
          $set: {
            "planOfActions.$.value": data.value,
            "planOfActions.$.assigned.to": data.assignedTo,
          },
        },
        { new: true }
      )
    );
    if (significantEventError) return [significantEvent, significantEventError];
    return asyncWrapper(() =>
      this.CQCSignificantEvent.populateCQCSignificantEvent(significantEvent)
    );
  }
  async deleteSignificantEventAction(id, action_id) {
    let [significantEvent, significantEventError] = await asyncWrapper(() =>
      this.CQCSignificantEvent.findOneAndUpdate(
        { _id: id },
        {
          $pull: { planOfActions: { _id: action_id } },
        },
        { new: true }
      )
    );
    if (significantEventError) return [significantEvent, significantEventError];
    return asyncWrapper(() =>
      this.CQCSignificantEvent.populateCQCSignificantEvent(significantEvent)
    );
  }
}

module.exports = CQC;
