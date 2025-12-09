const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../../services/triggers");
const { imsPaginationFormated } = require("../utility");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.trigger = new Trigger(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.fileHandler = new FileHandlerService(connection);
    this.User = models.users(connection);
    this.Group = models.iamgroups(connection);
    this.Risk = models.risks(connection);
    this.Audit = models.audits(connection);
    this.Incident = models.incidents(connection);
    this.ManagementReview = models.managementreviews(connection);
    this.HardwareAsset = models.hardwareassets(connection);
    this.SoftwareAsset = models.softwareassets(connection);
    this.PeopleAsset = models.peopleassets(connection);
    this.PremiseAsset = models.premiseassets(connection);
    this.InformationAsset = models.informationassets(connection);
    this.Supplier = models.suppliers(connection);
    this.Cip = models.cips(connection);
    this.Customer = models.customers(connection);
    this.Organization = models.organizations(connection);
    this.IamPolicy = models.iampolicies(connection);
    this.Compliance = models.complianceoverviews(connection);
    this.DocumentTree = models.documenttrees(connection);
    this.Membership = models.memberships(connection);
    this.Invoice = models.invoices(connection);
  }

  /**
   * Get default date range for stats
   * @param {Object} options - Options object
   * @param {Date} options.startDate - Optional start date
   * @param {Date} options.endDate - Optional end date
   * @param {number} options.months - Optional number of months to look back (defaults to 12)
   * @returns {Object} Object containing startDate and endDate
   */
  getDefaultDateRange({ startDate, endDate }) {
    const today = new Date();
    let defaultStartDate = startDate
      ? new Date(startDate)
      : new Date(2022, 0, 1); // January 1, 2022
    let defaultEndDate = endDate ? new Date(endDate) : new Date(2027, 0, 1); // January 1, 2027

    console.log("defaultStartDate", defaultStartDate);
    console.log("defaultEndDate", defaultEndDate);

    return {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      dateFilter: {
        createdAt: {
          $gte: defaultStartDate,
          $lte: defaultEndDate,
        },
      },
    };
  }

  /**
   * Get months array for the given date range
   * @param {Date} endDate - End date
   * @param {number} months - Number of months to include
   * @returns {Array} Array of month abbreviations
   */
  getMonthsArray(endDate, months) {
    const MONTH_OF_YEAR = [
      "",
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const result = [];
    let d = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // Always first of month

    // Go back (months - 1) months to get the start
    d.setMonth(d.getMonth() - (months - 1));

    for (let i = 0; i < months; i++) {
      result.push(MONTH_OF_YEAR[d.getMonth() + 1]);
      d.setMonth(d.getMonth() + 1);
    }
    return result;
  }

  /**
   * Create an array of zeros with specified length
   * @param {number} length - Length of the array
   * @returns {Array} Array filled with zeros
   */
  createZeroArray(length) {
    return Array.from({ length }, () => 0);
  }
}

module.exports = { Manager };
