const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { msToTime } = require("../../helpers/msToTime");
const {
  DocumentRepositoryService,
} = require("../documentManagement/repository");
const mongoose = require("mongoose");
const { formatCurrency } = require("../../helpers/formatCurrency");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS } = require("../../events/constants");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
const templates = require("../../models/mongodb/system/imsProject/templates/templates");
const {
  PROJECT_STATUSES,
  RAG_STATUS,
} = require("../../models/mongodb/system/imsProject/enums");
const { sendMail } = require("../../email/sendMail");

const population = [
  {
    path: "createdBy",
    select: "name email profileImageSrc accessPolicies jobTitle",
  },
  {
    path: "owners",
    select: "name email profileImageSrc accessPolicies jobTitle",
  },
  {
    path: "organization",
    select: "name logo",
  },
  {
    path: "group",
    select: "name",
  },
];
class ImsProject extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createImsProject(data) {
    if (!data) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    }
    let projectToBeCopied = null;

    const {
      title,
      startDate,
      endDate,
      customFields,
      ragStatus,
      settingsRiskTabPreference,
      settingsOfiTabPreference,
      settingsKpiTabPreference,
      settingsOfiTabGantTabPreference,
      settingsBudgetTabPreference,
      settingsMembersTabPreference,
      settingsMaterialsTabPreference,
      settingsDataImportTabPreference,
      copiedProjectId,
      contractValue,
      projectAddress,
      jobNumber,
    } = data;

    // Step 1: Create the project
    let newImsProject = new this.ImsProject({
      title,
      startDate,
      endDate,
      ragStatus,
      settingsRiskTabPreference,
      settingsOfiTabPreference,
      settingsKpiTabPreference,
      settingsOfiTabGantTabPreference,
      settingsBudgetTabPreference,
      settingsMembersTabPreference,
      settingsMaterialsTabPreference,
      settingsDataImportTabPreference,
      projectAddress,
      jobNumber,
      customFields: customFields || [],
      organization: this.connection.user.organizationId,
      createdBy: this.connection.user._id,
      repository: null,
      contractValue: contractValue,
    });

    newImsProject = await newImsProject.save();

    // Step 2: Create the repository
    if (copiedProjectId) {
      projectToBeCopied = await this.ImsProject.findById(copiedProjectId);
    }
    const DocumentRepository = new DocumentRepositoryService(this.connection);
    const repository = await DocumentRepository.createRepository(
      {
        name: title,
        description: `This repository contains all the content of the project ${title}.`,
        group: null,
        privacy: "Organisational",
        sharedWith: [],
        reviewInterval: "Yearly",
        owners: [this.connection.user?._id],
        created: {
          by: this.connection.user?._id,
          on: Date.now(),
        },
      },
      {
        sourceRepoId: projectToBeCopied?.repository || null,
      }
    );

    // Step 3: Update the project with the repository ID
    newImsProject.repository = repository._id;

    // Step 4: Handle copied project settings

   
    if (projectToBeCopied) {
      const cloneSections = (sections = []) =>
        sections.map((section) => {
          const sectionObj =
            typeof section?.toObject === "function"
              ? section.toObject()
              : { ...section };
          const {
            _id: _sectionId,
            customFields: sectionCustomFields = [],
            ...sectionRest
          } = sectionObj;

          return {
            ...sectionRest,
            customFields: sectionCustomFields.map((field) => {
              const fieldObj =
                typeof field?.toObject === "function"
                  ? field.toObject()
                  : { ...field };
              const { _id: _fieldId, ...fieldRest } = fieldObj;
              return fieldRest;
            }),
          };
        });

      const clonedSections = cloneSections(projectToBeCopied.sections);

      Object.assign(newImsProject, {
        gvProjectManagementPlan: projectToBeCopied.gvProjectManagementPlan,
        gvRiskManagementPlan: projectToBeCopied.gvRiskManagementPlan,
        gvCommunicationPlan: projectToBeCopied.gvCommunicationPlan,
        gvChangeManagementPlan: projectToBeCopied.gvChangeManagementPlan,
        gvLessonsLearnedReport: projectToBeCopied.gvLessonsLearnedReport,
        gvStatusReport: projectToBeCopied.gvStatusReport,
        gvQualityManagementPlan: projectToBeCopied.gvQualityManagementPlan,
        gvProjectCharter: projectToBeCopied.gvProjectCharter,
        gvWorkBreakDownStructure: projectToBeCopied.gvWorkBreakDownStructure,
        gvProcurementPlan: projectToBeCopied.gvProcurementPlan,
        settingsRiskTabPreference: projectToBeCopied.settingsRiskTabPreference,
        settingsOfiTabPreference: projectToBeCopied.settingsOfiTabPreference,
        settingsKpiTabPreference: projectToBeCopied.settingsKpiTabPreference,
        settingsOfiTabGantTabPreference:
          projectToBeCopied.settingsOfiTabGantTabPreference,
        settingsBudgetTabPreference:
          projectToBeCopied.settingsBudgetTabPreference,
        settingsMembersTabPreference:
          projectToBeCopied.settingsMembersTabPreference,
        settingsMaterialsTabPreference:
          projectToBeCopied?.settingsMaterialsTabPreference,
        settingsDataImportTabPreference:
          projectToBeCopied.settingsDataImportTabPreference,
        customFields: [
          ...(newImsProject.customFields || []),
          ...(projectToBeCopied.customFields || []),
        ],
        sections: clonedSections,
      });

      if (clonedSections.length) {
        newImsProject.markModified("sections");
      }
    }

    newImsProject = await newImsProject.save();
    mainChannel.topic(SERVER_EVENTS_BUS.NEW_PROJECT_CREATED).emit({
      accessControl: this.connection,
      imsProject: newImsProject,
    });

    const organization = await this.Organisation.findById(
      this.connection.user.organizationId
    );

    if (
      organization &&
      organization.reportSubscriptions &&
      organization.reportSubscriptions.length > 0
    ) {
      const emailPromises = organization.reportSubscriptions.map(
        (subscription) => {
          return sendMail("new-project-created", subscription.email, {
            subscriberName: subscription.name || "Subscriber",
            organizationName: organization.name,
            projectTitle: newImsProject.title,
            projectReference: newImsProject.reference,
            projectStartDate: newImsProject.startDate,
            projectEndDate: newImsProject.endDate,
            createdBy: this.connection.user.name,
            projectLink: `https://projects.imssystems.tech/project/${newImsProject._id}/overview`,
          });
        }
      );

      await Promise.all(emailPromises);
      console.log(
        `Notification emails sent to ${organization.reportSubscriptions.length} report subscribers`
      );
    }

    return this.ImsProject.findById(newImsProject._id).populate(population);
  }

  async getImsProject(query) {
    let exist = await this.ImsProject.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Project not found with given query."
      );
    return exist.populate(population);
  }
  async updateImsProject(id, data) {
    let imsProject = await this.getImsProject({ _id: id });

    if (imsProject.status === "Completed") {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "You can't update a Completed project."
      );
    }
    const propertyData = { ...data };
    delete propertyData.customFields;
    delete propertyData.sections; // Remove sections for separate update
    const customFields = data.customFields;
    const sections = data.sections;

    // Step1: Update the main project fields (excluding custom fields and sections)
    imsProject = await this.ImsProject.findOneAndUpdate(
      { _id: id },
      { $set: { ...propertyData } },
      { new: true }
    );

    // Step2: Update root-level customFields if present (legacy support)
    if (customFields && Array.isArray(customFields)) {
      await Promise.all(
        customFields.map((field) => {
          return this.ImsProject.updateOne(
            { _id: id, "customFields._id": field._id },
            { $set: { "customFields.$.value": field.value } }
          );
        })
      );
    }

    // Step3: Update nested customFields in sections
    if (sections && Array.isArray(sections)) {
      for (const section of sections) {
        if (section.customFields && Array.isArray(section.customFields)) {
          for (const field of section.customFields) {
            await this.ImsProject.updateOne(
              { _id: id },
              {
                $set: {
                  "sections.$[section].customFields.$[field].value":
                    field.value,
                },
              },
              {
                arrayFilters: [
                  { "section._id": section._id },
                  { "field._id": field._id },
                ],
              }
            );
          }
        }
      }
    }

    imsProject = await this.ImsProject.findOne({ _id: id });
    return imsProject.populate(population);
  }

  async listImsProject(query, options) {
    const aggregate = this.ImsProject.aggregate([
      {
        $match: {
          ...query,
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $lookup: {
          from: "imsprojectmemberships",
          localField: "_id",
          foreignField: "imsProjectId",
          as: "members",
          pipeline: [{ $limit: 5 }],
        },
      },

      {
        $addFields: {
          members: "$members",
        },
      },
      {
        $lookup: {
          from: "users",
          pipeline: [
            {
              $project: { _id: 1, firstName: 1, profileImageSrc: 1 },
            },
          ],
          localField: "members.userId",
          foreignField: "_id",
          as: "membersDetails",
        },
      },
      { $set: { members: "$membersDetails" } },
      { $unset: "membersDetails" },
    ]);

    const pagination = await this.ImsProject.aggregatePaginate(
      aggregate,
      options
    );
    return pagination;
  }
  async softRemoveImsProject(id) {
    const imsProject = await this.getImsProject({ _id: id });
    if (imsProject) {
      await this.ImsProject.softDelete({ _id: id });
      return imsProject;
    }
  }
  async restoreImsProject(id) {
    const imsProject = await this.getImsProject({ _id: id });
    if (imsProject) {
      await this.ImsProject.restore({ _id: id });
      return imsProject;
    }
  }
  async hardRemoveImsProject(id) {
    const imsProject = await this.getImsProject({ _id: id });
    // If project status is completed then it is not possible to update
    if (imsProject.status == "Completed")
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "You can't update Completed project."
      );
    if (imsProject) {
      await this.ImsProject.deleteOne({ _id: imsProject._id });
      await this.ImsProjectWorkPackage.deleteMany({
        imsProjectId: imsProject._id,
      });
      await this.ImsProjectMemberShip.deleteMany({
        imsProjectId: imsProject._id,
      });
      await this.ImsProjectBudget.deleteMany({
        imsProjectId: imsProject._id,
      });
      await this.ImsProjectReport.deleteMany({ imsProjectId: imsProject._id });
      await this.ImsProjectWorkPackageAssignment.deleteMany({
        imsProjectId: imsProject._id,
      });
      // await this.DocumentRepository.deleteMany({ _id: imsProject.repository });
      await this.DocumentRepositoryService.hardRemoveImsProject(
        imsProject.repository
      );
      return imsProject;
    }
  }

  async loadAnalytics(projectId) {
    let today = new Date();

    const possibleCombinations = [
      { type: "Task", status: "Pending" },
      { type: "Task", status: "In Progress" },
      { type: "Task", status: "Completed" },
      { type: "Milestone", status: "Pending" },
      { type: "Milestone", status: "In Progress" },
      { type: "Milestone", status: "Completed" },
    ];

    const workPackageByTypeAndStatusQuery =
      await this.ImsProjectWorkPackage.aggregate([
        {
          $match: {
            imsProjectId: new mongoose.Types.ObjectId(projectId),
            "deleteMarker.status": false,
          },
        },
        {
          $group: {
            _id: { type: "$type", status: "$status" },
            total: { $sum: 1 },
          },
        },
      ]);

    const workPackageByTypeAndStatus = possibleCombinations.map((combo) => {
      const found = workPackageByTypeAndStatusQuery.find(
        (item) =>
          item._id.type === combo.type && item._id.status === combo.status
      );
      return { ...combo, total: found ? found.total : 0 };
    });

    const totalMembersCount = await this.ImsProjectMemberShip.countDocuments({
      imsProjectId: new mongoose.Types.ObjectId(projectId),
    });

    const imsProject = await this.ImsProject.findOne({
      _id: new mongoose.Types.ObjectId(projectId),
    });
    const totalBudget = imsProject.expectedTotalBudget;
    const startDate = new Date(imsProject.startDate);
    const endDate = new Date(imsProject.endDate);
    let totalSpentBudget = await this.ImsProjectBudget.aggregate([
      {
        $match: {
          imsProjectId: new mongoose.Types.ObjectId(projectId),
          "deleteMarker.status": false,
        },
      },

      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);
    totalSpentBudget =
      totalSpentBudget.length > 0 ? totalSpentBudget[0].total : 0;

    const totalRemainingBudget = totalBudget - totalSpentBudget;

    // latest document
    const repositoryId = imsProject.repository;
    const latestDocuments = await this.DocumentTree.aggregate([
      {
        $match: {
          repository: new mongoose.Types.ObjectId(repositoryId),
          type: "document",
        },
      },
      { $sort: { updatedAt: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "created.by",
          foreignField: "_id",
          as: "createdByUser",
        },
      },
      {
        $unwind: {
          path: "$createdByUser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "created.by": {
            _id: "$createdByUser._id",
            name: "$createdByUser.name",
            email: "$createdByUser.email",
            profileImageSrc: "$createdByUser.profileImageSrc",
          },
        },
      },
      {
        $project: {
          createdByUser: 0,
        },
      },
    ]);

    // latest
    const latestMembers = await this.ImsProjectMemberShip.find({
      imsProjectId: new mongoose.Types.ObjectId(projectId),
    })
      .select("userId -_id")
      .limit(4)
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "userId",
          select: "name profileImageSrc",
        },
      ]);

    // average workpackage progress percentage
    const averageProgressPercentage =
      await this.ImsProjectWorkPackage.aggregate([
        {
          $match: {
            organization: new mongoose.Types.ObjectId(
              this.connection.user.organizationId
            ),
            imsProjectId: new mongoose.Types.ObjectId(projectId),
            "deleteMarker.status": false,
          },
        },
        {
          $group: {
            _id: null,
            averageProgressPercentage: { $avg: "$progressPercentage" },
          },
        },
        {
          $project: {
            _id: 0,
            averageProgressPercentage: 1,
          },
        },
      ]);

    const projectProgressPercentage =
      averageProgressPercentage.length > 0
        ? averageProgressPercentage[0].averageProgressPercentage
        : 0;

    const latestMilestones = await this.ImsProjectWorkPackage.find({
      imsProjectId: new mongoose.Types.ObjectId(projectId),
      type: "Milestone",
    })
      .select("title startDate endDate status")
      .limit(4)
      .sort({ endDate: -1 });
    let timeSpentMs = today - startDate;
    let timeSpentSymbol = timeSpentMs >= 0 ? "" : "-";
    timeSpentMs = Math.abs(timeSpentMs);
    let timeRemainingMs = endDate - today;
    let timeRemainingSymbol = timeRemainingMs >= 0 ? "" : "-";
    timeRemainingMs = Math.abs(timeRemainingMs);

    return {
      imsProject,
      workPackageByTypeAndStatus,
      projectProgressPercentage,
      latestMembers,
      latestMilestones,
      totalMembersCount,
      timeSpentMs,
      timeSpentSymbol,
      timeRemainingMs,
      timeRemainingSymbol,
      timeSpent: msToTime(timeSpentMs),
      timeRemaining: msToTime(timeRemainingMs),
      totalBudget,
      totalSpentBudget,
      totalRemainingBudget,
      latestDocuments,
      governance: [
        {
          label: "Project manager assigned",
          value: true,
        },
        {
          label: "Report",
          value: true,
        },
        {
          label: "Milestones",
          value: true,
        },
        {
          label: "Project charter",
          value: true,
        },
      ],
    };
  }

  async getImsProjectGantt(query, options) {
    // Create aggregation pipeline with hierarchical sorting
    const aggregate = this.ImsProjectWorkPackage.aggregate([
      {
        $match: {
          ...query,
          imsProjectId: new mongoose.Types.ObjectId(query.imsProjectId),
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $lookup: {
          from: "imsprojectworkpackagerelationships",
          localField: "_id",
          foreignField: "waitingWorkPackage",
          as: "dependecyRelation",
        },
      },
      {
        $lookup: {
          from: "imsprojectworkpackagerelationships",
          localField: "_id",
          foreignField: "childWorkPackage",
          as: "groupRelation",
        },
      },
      {
        $lookup: {
          from: "imsprojectworkpackages",
          let: { groupId: "$groupWorkPackage" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$groupId"] },
              },
            },
            {
              $project: {
                title: 1,
                type: 1,
                reference: 1,
                groupColorHex: 1,
                startDate: 1,
                ID: 1,
              },
            },
          ],
          as: "groupWorkPackageDetails",
        },
      },
      {
        $addFields: {
          groupWorkPackage: {
            $cond: {
              if: { $eq: [{ $size: "$groupWorkPackageDetails" }, 0] },
              then: null,
              else: { $arrayElemAt: ["$groupWorkPackageDetails", 0] },
            },
          },
        },
      },
      {
        $project: {
          groupWorkPackageDetails: 0,
        },
      },
      // Use $facet to separate and sort different types
      {
        $facet: {
          // Get all task groups sorted by start date
          taskGroups: [
            {
              $match: { type: "Task Group" },
            },
            {
              $sort: { startDate: 1 },
            },
          ],
          // Get all standalone tasks sorted by start date
          standaloneTasks: [
            {
              $match: {
                $and: [
                  { type: "Task" },
                  {
                    $or: [
                      { groupWorkPackage: null },
                      { groupWorkPackage: { $exists: false } },
                    ],
                  },
                ],
              },
            },
            {
              $sort: { startDate: 1 },
            },
          ],
          // Get all grouped tasks
          groupedTasks: [
            {
              $match: {
                $and: [{ type: "Task" }, { groupWorkPackage: { $ne: null } }],
              },
            },
          ],
        },
      },
      // Unwind and restructure
      {
        $project: {
          allItems: {
            $concatArrays: ["$taskGroups", "$standaloneTasks", "$groupedTasks"],
          },
        },
      },
      {
        $unwind: "$allItems",
      },
      {
        $replaceRoot: { newRoot: "$allItems" },
      },
      // Sort everything by start date (chronological order)
      {
        $sort: { startDate: 1 },
      },
      // Add a field to track if item is processed
      {
        $addFields: {
          isProcessed: false,
        },
      },
    ]);

    // Use aggregatePaginate for consistent pagination
    const pagination = await this.ImsProjectWorkPackage.aggregatePaginate(
      aggregate,
      options
    );

    // Now we need to reorganize the results to maintain hierarchy
    const reorganizedDocs = [];
    const processedItems = new Set();

    // Process items in chronological order
    for (const item of pagination.docs) {
      if (processedItems.has(item._id.toString())) {
        continue;
      }

      if (item.type === "Task Group") {
        // Add the task group
        reorganizedDocs.push(item);
        processedItems.add(item._id.toString());

        // Find and add all children of this task group
        const children = pagination.docs.filter(
          (wp) =>
            wp.type === "Task" &&
            wp.groupWorkPackage &&
            wp.groupWorkPackage._id.toString() === item._id.toString()
        );

        // Sort children by start date within the group
        children.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        children.forEach((child) => {
          reorganizedDocs.push(child);
          processedItems.add(child._id.toString());
        });
      } else if (item.type === "Task" && !item.groupWorkPackage) {
        // Add standalone task
        reorganizedDocs.push(item);
        processedItems.add(item._id.toString());
      }
      // Skip grouped tasks as they're already added with their parent task group
    }

    // Update the pagination result with reorganized docs
    pagination.docs = reorganizedDocs;

    return pagination;
  }
  // async dashboard() {
  //   // Total Number of Project
  //   const totalNumberOfProjectResult = await this.ImsProject.aggregate([
  //     {
  //       $match: {
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //         "deleteMarker.status": false,
  //       },
  //     },
  //     {
  //       $count: "totalProjects",
  //     },
  //   ]);

  //   // Total Number of Budget
  //   const totalBudgetResult = await this.ImsProject.aggregate([
  //     {
  //       $match: {
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //         "deleteMarker.status": false,
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         totalCost: { $sum: "$expectedTotalBudget" },
  //       },
  //     },
  //   ]);

  //   const totalNumberOfProject =
  //     totalNumberOfProjectResult.length > 0
  //       ? totalNumberOfProjectResult[0].totalProjects
  //       : 0;

  //   const totalBudget = totalBudgetResult[0]?.totalCost || 0;

  //   // Time Line of project with start date and end Date
  //   const timeline = await this.ImsProject.aggregate([
  //     {
  //       $match: {
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //         "deleteMarker.status": false,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         reference: 1,
  //         title: 1,
  //         startDate: 1,
  //         endDate: 1,
  //       },
  //     },
  //     {
  //       $sort: {
  //         startDate: 1,
  //       },
  //     },
  //     {
  //       $limit: 100,
  //     },
  //   ]);

  //   const projectProgressPercentage = await this.ImsProject.aggregate([
  //     {
  //       $match: {
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //         "deleteMarker.status": false,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "imsprojectworkpackages",
  //         localField: "_id",
  //         foreignField: "imsProjectId",
  //         as: "workPackages",
  //       },
  //     },
  //     {
  //       $addFields: {
  //         averageProgress: {
  //           $cond: {
  //             if: { $gt: [{ $size: "$workPackages" }, 0] },
  //             then: {
  //               $avg: "$workPackages.progressPercentage",
  //             },
  //             else: 0,
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         title: 1,
  //         reference: 1,
  //         averageProgress: 1,
  //       },
  //     },
  //   ]);

  //   // total budget according to project status

  //   const possibleStatuses = ["Todo", "In Progress", "Completed"];

  //   const budgetByStatus = await this.ImsProject.aggregate([
  //     {
  //       $match: {
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //         "deleteMarker.status": false,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "imsprojectbudgets",
  //         localField: "_id",
  //         foreignField: "imsProjectId",
  //         as: "budgets",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$budgets",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$status",
  //         totalBudget: { $sum: "$budgets.total" },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         status: "$_id",
  //         totalBudget: 1,
  //       },
  //     },
  //   ]);

  //   const result = possibleStatuses.reduce((acc, status) => {
  //     acc[status] = 0;
  //     return acc;
  //   }, {});

  //   budgetByStatus.forEach(({ status, totalBudget }) => {
  //     result[status] = totalBudget;
  //   });

  //   const top20TotalBudgetByProject = await this.ImsProject.aggregate([
  //     {
  //       $match: {
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //         "deleteMarker.status": false,
  //       },
  //     },
  //     {
  //       $limit: 20,
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         projectId: "$_id",
  //         projectName: "$title",
  //         reference: "$reference",
  //         totalBudget: "$expectedTotalBudget",
  //       },
  //     },
  //     {
  //       $sort: {
  //         totalBudget: -1,
  //       },
  //     },
  //   ]);

  //   const possibleTypes = ["Task", "Milestone"];

  //   // Aggregate average progress percentage by type and project
  //   const averageProgressByType = await this.ImsProjectWorkPackage.aggregate([
  //     {
  //       $match: {
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //         "deleteMarker.status": false,
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: {
  //           projectId: "$imsProjectId",
  //           type: "$type",
  //         },
  //         averageProgress: { $avg: "$progressPercentage" },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$_id.projectId",
  //         types: {
  //           $push: {
  //             type: "$_id.type",
  //             averageProgress: "$averageProgress",
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "imsprojects",
  //         localField: "_id",
  //         foreignField: "_id",
  //         as: "projectDetails",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$projectDetails",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         projectId: "$_id",
  //         projectName: "$projectDetails.title",
  //         reference: "$projectDetails.reference",
  //         types: {
  //           $arrayToObject: {
  //             $map: {
  //               input: "$types",
  //               as: "type",
  //               in: {
  //                 k: "$$type.type",
  //                 v: "$$type.averageProgress",
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   ]);

  //   // Transform the result to ensure all types are included with a default value of 0
  //   const workPackageByType = averageProgressByType.map((project) => {
  //     const typesWithDefault = possibleTypes.reduce((acc, type) => {
  //       acc[type] = 0;
  //       return acc;
  //     }, {});

  //     project.types = { ...typesWithDefault, ...project.types };

  //     return project;
  //   });

  //   // projects with date and delay

  //   const currentDate = new Date();

  //   const projectTimeWithDelay = await this.ImsProject.aggregate([
  //     {
  //       $match: {
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //         "deleteMarker.status": false,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         imsProjectId: "$_id",
  //         title: "$title",
  //         reference: "$reference",
  //         startDate: { $toLong: "$startDate" },
  //         endDate: { $toLong: "$endDate" },
  //         delayTime: {
  //           $cond: {
  //             if: {
  //               $and: [
  //                 { $ne: ["$status", "Completed"] },
  //                 { $lt: ["$endDate", currentDate] },
  //               ],
  //             },
  //             then: { $subtract: [currentDate, "$endDate"] },
  //             else: 0,
  //           },
  //         },
  //         projectTime: {
  //           $cond: {
  //             if: {
  //               $and: [
  //                 { $ne: ["$endDate", null] },
  //                 { $ne: ["$startDate", null] },
  //               ],
  //             },
  //             then: { $subtract: ["$endDate", "$startDate"] },
  //             else: 0,
  //           },
  //         },
  //       },
  //     },
  //   ]);

  //   // total delay time

  //   let totalDelayTime = 0;

  //   // Loop through the projectTimeWithDelay array and sum the delayTime
  //   projectTimeWithDelay.forEach((project) => {
  //     totalDelayTime += project.delayTime;
  //   });

  //   // Project Status
  //   const projectStatusArray = Object.values(PROJECT_STATUSES);
  //   let projectsStatusStat = await this.ImsProject.aggregate([
  //     {
  //       $match: {
  //         "deleteMarker.status": false,
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$status",
  //         count: {
  //           $sum: 1,
  //         },
  //       },
  //     },
  //   ]);

  //   const projectsByStatus = projectStatusArray.map((status) => ({
  //     _id: status,
  //     count: 0,
  //   }));

  //   projectsStatusStat.forEach(({ _id, count }) => {
  //     const status = projectsByStatus.find((item) => item._id === _id);
  //     if (status) {
  //       status.count = count;
  //     }
  //   });

  //   // Rag status count

  //   const ragStatusArray = Object.values(RAG_STATUS);
  //   const ragStatusCount = await this.ImsProject.aggregate([
  //     {
  //       $match: {
  //         organization: new mongoose.Types.ObjectId(
  //           this.connection.user.organizationId
  //         ),
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$ragStatus",
  //         count: { $sum: 1 },
  //       },
  //     },
  //   ]);
  //   // Prepare default result with all RAG statuses initialized to 0
  //   const ragStatus = ragStatusArray.map((status) => ({
  //     _id: status,
  //     count: 0,
  //   }));

  //   ragStatusCount.forEach(({ _id, count }) => {
  //     const status = ragStatus.find((item) => item._id === _id);
  //     if (status) {
  //       status.count = count;
  //     }
  //   });

  //   return {
  //     totalNumberOfProject,
  //     totalBudget: formatCurrency(totalBudget),
  //     timeline,
  //     projectProgressPercentage,
  //     budgetByStatus: result,
  //     workPackagePercentage: workPackageByType,
  //     top20TotalBudgetByProject,
  //     projectTimeWithDelay,
  //     totalDelayTime: msToTime(totalDelayTime),
  //     projectsByStatus,
  //     ragStatus,
  //   };
  // }

  // work package status

  async dashboard() {
    // Total Number of Project
    const totalNumberOfProjectResult = await this.ImsProject.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $count: "totalProjects",
      },
    ]);
    // overall project completion percentage
    const completedProjectsResult = await this.ImsProject.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
          status: PROJECT_STATUSES.COMPLETED,
        },
      },
      {
        $count: "completedProjects",
      },
    ]);

    const totalProjects =
      totalNumberOfProjectResult.length > 0
        ? totalNumberOfProjectResult[0].totalProjects
        : 0;
    const completedProjects =
      completedProjectsResult.length > 0
        ? completedProjectsResult[0].completedProjects
        : 0;

    // Total Number of Budget
    const totalBudgetResult = await this.ImsProject.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$expectedTotalBudget" },
        },
      },
    ]);

    const totalNumberOfProject =
      totalNumberOfProjectResult.length > 0
        ? totalNumberOfProjectResult[0].totalProjects
        : 0;

    const totalBudget = totalBudgetResult[0]?.totalCost || 0;

    // Time Line of project with start date and end Date
    const timeline = await this.ImsProject.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $project: {
          _id: 1,
          reference: 1,
          title: 1,
          startDate: 1,
          endDate: 1,
        },
      },
      {
        $sort: {
          startDate: 1,
        },
      },
      {
        $limit: 100,
      },
    ]);

    const projectProgressPercentage = await this.ImsProject.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $lookup: {
          from: "imsprojectworkpackages",
          localField: "_id",
          foreignField: "imsProjectId",
          as: "workPackages",
        },
      },
      {
        $addFields: {
          averageProgress: {
            $cond: {
              if: { $gt: [{ $size: "$workPackages" }, 0] },
              then: {
                $avg: "$workPackages.progressPercentage",
              },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          reference: 1,
          averageProgress: 1,
        },
      },
    ]);

    // total budget according to project status

    const possibleStatuses = ["Todo", "In Progress", "Completed"];

    const budgetByStatus = await this.ImsProject.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $lookup: {
          from: "imsprojectbudgets",
          localField: "_id",
          foreignField: "imsProjectId",
          as: "budgets",
        },
      },
      {
        $unwind: {
          path: "$budgets",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$status",
          totalBudget: { $sum: "$budgets.total" },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          totalBudget: 1,
        },
      },
    ]);

    const result = possibleStatuses.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    budgetByStatus.forEach(({ status, totalBudget }) => {
      result[status] = totalBudget;
    });

    const top20TotalBudgetByProject = await this.ImsProject.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $limit: 20,
      },
      {
        $project: {
          _id: 0,
          projectId: "$_id",
          projectName: "$title",
          reference: "$reference",
          totalBudget: "$expectedTotalBudget",
        },
      },
      {
        $sort: {
          totalBudget: -1,
        },
      },
    ]);

    const possibleTypes = ["Task", "Milestone"];

    // Aggregate average progress percentage by type and project
    const averageProgressByType = await this.ImsProjectWorkPackage.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $group: {
          _id: {
            projectId: "$imsProjectId",
            type: "$type",
          },
          averageProgress: { $avg: "$progressPercentage" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.projectId",
          types: {
            $push: {
              type: "$_id.type",
              averageProgress: "$averageProgress",
              count: "$count",
            },
          },
          totalProgress: { $avg: "$averageProgress" },
        },
      },
      {
        $lookup: {
          from: "imsprojects",
          localField: "_id",
          foreignField: "_id",
          as: "projectDetails",
        },
      },
      {
        $unwind: {
          path: "$projectDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "imsprojectworkpackages",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$imsProjectId", "$$projectId"] },
                    { $ne: ["$status", "Completed"] },
                    { $lt: ["$endDate", new Date()] },
                  ],
                },
              },
            },
            {
              $count: "overdueCount",
            },
          ],
          as: "overdueWorkPackages",
        },
      },
      {
        $project: {
          _id: 0,
          projectId: "$_id",
          projectName: "$projectDetails.title",
          reference: "$projectDetails.reference",
          overallProgress: { $round: ["$totalProgress", 2] },
          totalOverdue: {
            $ifNull: [
              { $arrayElemAt: ["$overdueWorkPackages.overdueCount", 0] },
              0,
            ],
          },
          types: {
            $arrayToObject: {
              $map: {
                input: "$types",
                as: "type",
                in: {
                  k: "$$type.type",
                  v: {
                    progress: { $round: ["$$type.averageProgress", 2] },
                    count: "$$type.count",
                  },
                },
              },
            },
          },
        },
      },
    ]);

    // Get all projects to ensure we include those without work packages
    const allProjects = await this.ImsProject.find({
      organization: new mongoose.Types.ObjectId(
        this.connection.user.organizationId
      ),
      "deleteMarker.status": false,
    }).select("_id title reference");

    // Transform the result to ensure all projects are included with default values
    const workPackageByType = allProjects.map((project) => {
      const projectData = averageProgressByType.find(
        (p) => p.projectId.toString() === project._id.toString()
      );

      if (projectData) {
        return projectData;
      }

      // If no work packages exist for this project, create default entry
      return {
        projectId: project._id,
        projectName: project.title,
        reference: project.reference,
        overallProgress: 0,
        totalOverdue: 0,
        types: {
          Task: { progress: 0, count: 0 },
          Milestone: { progress: 0, count: 0 },
          "Task Group": { progress: 0, count: 0 },
        },
      };
    });

    // Transform the result to ensure all types are included with a default value of 0
    const workPackageByTypeWithDefaults = workPackageByType.map((project) => {
      const typesWithDefault = possibleTypes.reduce((acc, type) => {
        acc[type] = { progress: 0, count: 0 };
        return acc;
      }, {});

      project.types = { ...typesWithDefault, ...project.types };

      return project;
    });

    // projects with date and delay

    const currentDate = new Date();

    const projectTimeWithDelay = await this.ImsProject.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          "deleteMarker.status": false,
        },
      },
      {
        $project: {
          _id: 0,
          imsProjectId: "$_id",
          title: "$title",
          reference: "$reference",
          startDate: { $toLong: "$startDate" },
          endDate: { $toLong: "$endDate" },
          delayTime: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$status", "Completed"] },
                  { $lt: ["$endDate", currentDate] },
                ],
              },
              then: { $subtract: [currentDate, "$endDate"] },
              else: 0,
            },
          },
          projectTime: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$endDate", null] },
                  { $ne: ["$startDate", null] },
                ],
              },
              then: { $subtract: ["$endDate", "$startDate"] },
              else: 0,
            },
          },
        },
      },
    ]);

    // total delay time

    let totalDelayTime = 0;

    // Loop through the projectTimeWithDelay array and sum the delayTime
    projectTimeWithDelay.forEach((project) => {
      totalDelayTime += project.delayTime;
    });

    // Project Status
    const projectStatusArray = Object.values(PROJECT_STATUSES);
    let projectsStatusStat = await this.ImsProject.aggregate([
      {
        $match: {
          "deleteMarker.status": false,
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const projectsByStatus = projectStatusArray.map((status) => ({
      _id: status,
      count: 0,
    }));

    projectsStatusStat.forEach(({ _id, count }) => {
      const status = projectsByStatus.find((item) => item._id === _id);
      if (status) {
        status.count = count;
      }
    });

    // Rag status count

    const ragStatusArray = Object.values(RAG_STATUS);
    const ragStatusCount = await this.ImsProject.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
        },
      },
      {
        $group: {
          _id: "$ragStatus",
          count: { $sum: 1 },
        },
      },
    ]);
    // Prepare default result with all RAG statuses initialized to 0
    const ragStatus = ragStatusArray.map((status) => ({
      _id: status,
      count: 0,
    }));

    ragStatusCount.forEach(({ _id, count }) => {
      const status = ragStatus.find((item) => item._id === _id);
      if (status) {
        status.count = count;
      }
    });

    // Calculate overall project percentage as average of projectProgressPercentage
    const overallProjectPercentage =
      projectProgressPercentage.length > 0
        ? Math.round(
            (projectProgressPercentage.reduce(
              (sum, project) => sum + (project.averageProgress || 0),
              0
            ) /
              projectProgressPercentage.length) *
              100
          ) / 100
        : 0;

    return {
      totalNumberOfProject,
      overallProjectPercentage,
      totalCompletedProjects: completedProjects,
      totalBudget: formatCurrency(totalBudget),
      timeline,
      projectProgressPercentage,
      budgetByStatus: result,
      workPackagePercentage: workPackageByTypeWithDefaults,
      top20TotalBudgetByProject,
      projectTimeWithDelay,
      totalDelayTime: msToTime(totalDelayTime),
      projectsByStatus,
      ragStatus,
    };
  }

  async createWorkPackageStatus(projectId, data) {
    const imsProject = await this.getImsProject({ _id: projectId });
    if (imsProject) {
      const { workPackageStatus } = data;

      // Check if any of the given statuses already exist
      const existingStatuses = imsProject.workPackageStatuses.map(
        (status) => status.value
      );
      const duplicateStatuses = workPackageStatus.filter((status) =>
        existingStatuses.includes(status)
      );

      if (duplicateStatuses.length > 0) {
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          `The following work package statuses already exist: ${duplicateStatuses.join(
            ", "
          )}`
        );
      }

      // Add new statuses
      const newStatuses = workPackageStatus.map((status) => ({
        value: status,
      }));
      const updateImsProjectWorkPackageStatus =
        await this.ImsProject.findByIdAndUpdate(
          projectId,
          { $push: { workPackageStatuses: { $each: newStatuses } } },
          { new: true }
        );
      return updateImsProjectWorkPackageStatus;
    }
    return null;
  }

  async deleteWorkPackageStatus(projectId, workPackageStatuses) {
    const imsProject = await this.getImsProject({ _id: projectId });
    if (imsProject) {
      const currentStatuses = imsProject.workPackageStatuses;

      const missingStatuses = workPackageStatuses.filter(
        (status) => !currentStatuses.includes(status)
      );

      if (missingStatuses.length > 0) {
        throw new APIError(
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
          `The following work package statuses are not found: ${missingStatuses.join(
            ", "
          )}`
        );
      }
      const updatedImsProject = await this.ImsProject.findByIdAndUpdate(
        projectId,
        { $pull: { workPackageStatuses: { $in: workPackageStatuses } } },
        { new: true }
      );
      return updatedImsProject;
    }
    return null;
  }
  async addSection(projectId, data) {
    const imsProject = await this.getImsProject({ _id: projectId });
    if (imsProject) {
      const updatedProject = await this.ImsProject.findByIdAndUpdate(
        projectId,
        { $push: { sections: { name: data.sectionName, customFields: [] } } },
        { new: true }
      );
      return updatedProject;
    }
  }

  async addCustomFieldToSection(projectId, sectionId, data) {
    const imsProject = await this.getImsProject({ _id: projectId });
    if (imsProject) {
      const updatedProject = await this.ImsProject.findOneAndUpdate(
        { _id: projectId, "sections._id": sectionId },
        { $push: { "sections.$.customFields": { ...data } } },
        { new: true }
      );
      return updatedProject;
    }
  }

  async deleteCustomField(projectId, fieldId) {
    // Check if the custom field exists in any section
    const imsProject = await this.ImsProject.findOne({
      _id: projectId,
      "sections.customFields._id": fieldId,
    });

    console.log("Custom field is", imsProject);

    if (!imsProject) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        `Custom Field not found.`
      );
    }

    const updatedProject = await this.ImsProject.findOneAndUpdate(
      { _id: projectId },
      { $pull: { "sections.$[].customFields": { _id: fieldId } } },
      { new: true }
    );

    return updatedProject;
  }

  async deleteSection(projectId, sectionId) {
    const imsProject = await this.ImsProject.findOne({
      _id: projectId,
      "sections._id": sectionId,
    });

    console.log("Section is", imsProject);

    if (!imsProject) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        `Section not found.`
      );
    }

    const updatedProject = await this.ImsProject.findByIdAndUpdate(
      projectId,
      { $pull: { sections: { _id: sectionId } } },
      { new: true }
    );

    return updatedProject;
  }

  async reorderSection(projectId, data) {
    const { sectionId, targetSectionId } = data;
    if (sectionId === targetSectionId) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "sectionId and targetSectionId cannot be the same."
      );
    }

    // Fetch the project document
    const project = await this.getImsProject({ _id: projectId });
    // Find section indices
    const sections = project.sections;
    const sectionIndex = sections.findIndex(
      (s) => s._id.toString() === sectionId
    );
    const targetIndex = sections.findIndex(
      (s) => s._id.toString() === targetSectionId
    );

    if (sectionIndex === -1 || targetIndex === -1) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "One or both sections not found."
      );
    }

    // Remove section from its current position and insert it at the target position
    const [sectionToMove] = sections.splice(sectionIndex, 1);
    sections.splice(targetIndex, 0, sectionToMove);

    // Update in DB (atomic operation)
    await project.updateOne({ $set: { sections } });
    const updatedImsProject = await this.getImsProject({ _id: projectId });

    return updatedImsProject;
  }

  async reorderCustomField(projectId, data) {
    const { sectionId, customFieldId, targetFieldId } = data;
    if (customFieldId === targetFieldId) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "customFieldId and targetFieldId cannot be the same."
      );
    }

    // Fetch the project document
    const project = await this.getImsProject({ _id: projectId });
    if (!project) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Project not found."
      );
    }

    // Find the section containing the custom field
    const section = project.sections.find(
      (section) => section._id.toString() === sectionId
    );

    if (!section) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Section not found."
      );
    }

    // Find the custom field in the section
    const customFieldIndex = section.customFields.findIndex(
      (field) => field._id.toString() === customFieldId
    );

    if (customFieldIndex === -1) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Custom field not found."
      );
    }

    // Find the target index for repositioning
    const targetIndex = section.customFields.findIndex(
      (field) => field._id.toString() === targetFieldId
    );

    if (targetIndex === -1) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Target field not found."
      );
    }

    // Remove the custom field from its original position
    const [customField] = section.customFields.splice(customFieldIndex, 1);

    // Insert it at the target position
    section.customFields.splice(targetIndex, 0, customField);

    // Update in DB (atomic operation)
    const updatedProject = await project.updateOne({
      $set: { sections: project.sections },
    });

    // Return the full updated project
    return await this.getImsProject({ _id: projectId });
  }

  async deleteWorkPackageStatus(projectId, workPackageStatusId) {
    const imsProject = await this.getImsProject({ _id: projectId });

    const currentIds = imsProject.workPackageStatuses.map((status) =>
      status._id.toString()
    );

    // Check if the given ID exists
    if (!currentIds.includes(workPackageStatusId)) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        `Work package status ID not found: ${workPackageStatusId}`
      );
    }

    // Perform deletion
    const updatedImsProject = await this.ImsProject.findByIdAndUpdate(
      projectId,
      { $pull: { workPackageStatuses: { _id: workPackageStatusId } } },
      { new: true }
    );

    return updatedImsProject;
  }
}

module.exports = { ImsProject };
