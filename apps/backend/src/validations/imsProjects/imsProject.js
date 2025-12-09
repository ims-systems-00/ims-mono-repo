const Joi = require("joi");
const {
  ROLES,
  WORK_LOCATION_TYPE,
  IMS_FORM_FIELDS,
} = require("../../models/mongodb/schemaTemplates/references/typesAndEnums");
const {
  PROJECT_STATUSES,
  RAG_STATUS,
} = require("../../models/mongodb/system/imsProject/enums");

const membershipBaseStructure = {
  invitedUserId: Joi.string().required().label("Invited User Id"),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .label("Role"),
};
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const customFieldSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(IMS_FORM_FIELDS))
    .required(),
  label: Joi.string().required(),
  validations: Joi.object({
    plainTextRules: Joi.string().allow("").optional(),
    dateRule: Joi.object().optional().allow(""),
    numericRule: Joi.object().optional(),
  }).optional(),
  placeholder: Joi.string().optional(),
  isRequired: Joi.boolean().optional(),
  maxLength: Joi.number().optional(),
  minDate: Joi.date().optional(),
  maxDate: Joi.date().optional().label("maxDate"),
  value: Joi.alternatives()
    .label("value")
    .try(Joi.string(), Joi.boolean(), Joi.date())
    .optional()
    .label("value"),
  options: Joi.array().items(Joi.string()).optional().label("options"),
});

const createiMSProject = Joi.object({
  title: Joi.string().required().min(3).label("title"),
  startDate: Joi.date().required().label("startDate"),
  copiedProjectId: Joi.string().allow("", null).optional(),
  endDate: Joi.date().min(Joi.ref("startDate")).required().label("endDate"),
  customFields: Joi.array()
    .optional()
    .items(customFieldSchema)
    .label("customFields"),
  ragStatus: Joi.string()
    .valid(...Object.values(RAG_STATUS))
    .optional()
    .label("ragStatus"),
  settingsRiskTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsRiskTabPreference"),
  settingsOfiTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsOfiTabPreference"),
  settingsKpiTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsKpiTabPreference"),
  settingsOfiTabGantTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsOfiTabGantTabPreference"),
  settingsBudgetTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsBudgetTabPreference"),
  settingsMembersTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsMembersTabPreference"),
  settingsMaterialsTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsMaterialsTabPreference"),
  settingsDataImportTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsDataImportTabPreference"),
  contractValue: Joi.number().min(0).label("contractValue"),
  projectAddress: Joi.string().optional().label("projectAddress"),
  jobNumber: Joi.string().optional().label("jobNumber"),
});

const updateiMSProject = Joi.object({
  title: Joi.string().optional().min(3).label("title"),
  description: Joi.string().optional().max(28000).label("description"),
  startDate: Joi.date().optional().label("startDate"),
  endDate: Joi.date().min(Joi.ref("startDate")).optional().label("endDate"),
  expectedStartdate: Joi.date().optional().label("expectedStartdate"),
  expectedEndDate: Joi.date()
    .min(Joi.ref("expectedStartdate"))
    .optional()
    .label("expectedEndDate"),
  expectedTotalBudget: Joi.number().label("expectedTotalBudget"),
  contractValue: Joi.number().min(0).label("contractValue"),
  group: Joi.string().allow(null).optional().label("group"),
  owners: Joi.array().items(Joi.string()).optional().label("owners"),
  sections: Joi.array().optional().label("sections"),
  status: Joi.string()
    .valid(...Object.values(PROJECT_STATUSES))
    .optional()
    .label("status"),
  ragStatus: Joi.string()
    .valid(...Object.values(RAG_STATUS))
    .optional()
    .label("ragStatus"),
  gvProjectCharter: Joi.boolean()
    .default(false)
    .optional()
    .label("gvProjectCharter"),
  gvWorkBreakDownStructure: Joi.boolean()
    .default(false)
    .optional()
    .label("gvWorkBreakDownStructure"),
  gvQualityManagementPlan: Joi.boolean()
    .default(false)
    .optional()
    .label("gvQualityManagementPlan"),
  gvProjectManagementPlan: Joi.boolean()
    .default(false)
    .optional()
    .label("gvProjectManagementPlan"),
  gvRiskManagementPlan: Joi.boolean()
    .default(false)
    .optional()
    .label("gvRiskManagementPlan"),
  gvCommunicationPlan: Joi.boolean()
    .default(false)
    .optional()
    .label("gvCommunicationPlan"),
  gvChangeManagementPlan: Joi.boolean()
    .default(false)
    .optional()
    .label("gvChangeManagementPlan"),
  gvLessonsLearnedReport: Joi.boolean()
    .default(false)
    .optional()
    .label("gvLessonsLearnedReport"),
  gvStatusReport: Joi.boolean()
    .default(false)
    .optional()
    .label("gvStatusReport"),
  customFields: Joi.array().optional().label("customFields"),
  gvProcurementPlan: Joi.boolean()
    .default(false)
    .optional()
    .label("gvProcurementPlan"),
  projectChecklistViewed: Joi.boolean()
    .optional()
    .label("projectChecklistViewed"),
  settingsRiskTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsRiskTabPreference"),
  settingsOfiTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsOfiTabPreference"),
  settingsKpiTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsKpiTabPreference"),
  settingsOfiTabGantTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsOfiTabGantTabPreference"),
  settingsBudgetTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsBudgetTabPreference"),
  settingsMembersTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsMembersTabPreference"),
  settingsMaterialsTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsMaterialsTabPreference"),
  settingsDataImportTabPreference: Joi.boolean()
    .default(true)
    .optional()
    .label("settingsDataImportTabPreference"),
  projectAddress: Joi.string().optional().label("projectAddress"),
  jobNumber: Joi.string().optional().label("jobNumber"),
});

const createWorkPackageStatusSchema = Joi.object({
  workPackageStatus: Joi.array().items(Joi.string()).min(1).required(),
});

const createSectionIntoProjectValidation = Joi.object({
  sectionName: Joi.string().required().label("sectionName"),
});

// Schema for deleteWorkPackageStatus request body
const deleteWorkPackageStatusSchema = Joi.object({
  workPackageStatuses: Joi.array().items(Joi.string()).min(1).required(),
});

const reorderSectionSchema = Joi.object({
  sectionId: objectIdJoi.objectId.required().label("sectionId"),
  targetSectionId: objectIdJoi.objectId.required().label("targetSectionId"),
});

const reorderFieldSchema = Joi.object({
  customFieldId: objectIdJoi.objectId.required().label("sectionId"),
  targetFieldId: objectIdJoi.objectId.required().label("targetSectionId"),
});

module.exports = {
  createiMSProject,
  updateiMSProject,
  createWorkPackageStatusSchema,
  deleteWorkPackageStatusSchema,
  createSectionIntoProjectValidation,
  customFieldSchema,
  reorderSectionSchema,
  reorderFieldSchema,
};
