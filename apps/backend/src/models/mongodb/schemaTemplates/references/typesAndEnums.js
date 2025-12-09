const PAYMENT_METHODS = {
  CARD: "Card",
  MONTHLY_INVOICE: "Monthly invoice",
};
const PAYMENT_STATUS = {
  TRIAL: "Trial",
  SUBSCRIBED: "Subscribed",
  UNSUBSCRIBED: "Unsubscribed",
};
const ROLES = {
  SUPER_ADMIN: "Super Admin",
  HEAD_OF_SERVICE: "Head of Service",
  BASIC_USER: "Basic User",
  AUDITOR: "Auditor",
  INTERNAL_AUDITOR: "Internal Auditor",
  EXTERNAL_AUDITOR: "External Auditor",
  EXTERNAL_USER: "External User",
};
const WORK_LOCATION_TYPE = {
  REMOTE: "Remote",
  ON_SITE: "On-site",
};
const VERIFICATION_STATUS = {
  VERIFIED: "Verified",
  PENDING: "Pending",
};

const ADMIN_ROLES = {
  IMS_ADMIN: "iMS Admin",
  IMS_STANDARD_USER: "iMS Standard User",
};
const PARTNERSHIP_PROGRAM_STATUS = {
  IMS_ACCEPTED: "iMS Accepted",
  PENDING: "Pending",
};
const ORGANISATTION_STATUS = {
  ACTIVE: "Running",
  BLOCKED: "Paused",
};
const IMS_FORM_FIELDS = {
  TEXT_INPUT: "text-input",
  NUMBER_INPUT: "number-input",
  SINGLE_SELECT: "single-select",
  DATE_INPUT: "date-input",
};

const IMS_FORM_ELEMENTS_TYPE = {
  INPUT: "Input",
  LONG_TEXT: "Long Text",
  EMAIL: "Email",
  ADDRESS: "Address",
};

const MONTHS = [
  "Jan", // January
  "Feb", // February
  "Mar", // March
  "Apr", // April
  "May", // May
  "Jun", // June
  "Jul", // July
  "Aug", // August
  "Sep", // September
  "Oct", // October
  "Nov", // November
  "Dec", // December
];
module.exports = {
  ROLES,
  VERIFICATION_STATUS,
  ADMIN_ROLES,
  PARTNERSHIP_PROGRAM_STATUS,
  PAYMENT_METHODS,
  WORK_LOCATION_TYPE,
  ORGANISATTION_STATUS,
  PAYMENT_STATUS,
  IMS_FORM_FIELDS,
  MONTHS,
  IMS_FORM_ELEMENTS_TYPE,
};
