const UserModel = require("../models/mongodb/system/users&auth/user");
const ExpenseReportsModel = require("../models/mongodb/system/wallet/expenseReports");
const { asynchronously, imsPaginationFormated } = require("./utility");
const {
  insertionFactory,
  updaterFactory,
  removalFactory,
  pusherFactory,
} = require("./expensereports/factory");

class ExpensesService {
  constructor(connection) {
    this.connection = connection;
    this.User = UserModel(connection);
    this.ExpensesReport = ExpenseReportsModel(connection);
  }
  async createReport(data) {
    const [userError, { lineManagers }] = await asynchronously(
      this.User.findById(data.created.by)
    );
    if (userError) return [userError, null];
    if (!lineManagers)
      return [{ message: "No line manager assigned to user" }, null];
    let [reportError, report] = await asynchronously(
      this.ExpensesReport.create({
        ...data,
        submission: {
          lineManagers,
        },
      })
    );
    if (reportError) return [reportError, report];
    return asynchronously(this.ExpensesReport.populateExpenseReport(report));
  }
  async getReports(query, options) {
    let [reportsError, pagination] = await asynchronously(
      this.ExpensesReport.paginate(query, options)
    );
    if (reportsError) return [reportsError, pagination];
    let reports = pagination.docs;
    let [populationError, populatedReports] = await asynchronously(
      Promise.all(
        reports.map((report) =>
          this.ExpensesReport.populateExpenseReport(report)
        )
      )
    );
    if (populationError) return [populationError, populatedReports];
    return [
      null,
      {
        reports: populatedReports,
        pagination: imsPaginationFormated(pagination),
      },
    ];
  }
  async getReport(id) {
    let [reportError, report] = await asynchronously(
      this.ExpensesReport.findOne({ _id: id })
    );
    if (reportError) return [reportError, report];
    if (!report)
      return [{ message: "No report was found with the id." }, report];
    return asynchronously(this.ExpensesReport.populateExpenseReport(report));
  }
  async updateReport(id, data) {
    let [reportError, report] = await asynchronously(
      this.ExpensesReport.findOneAndUpdate(
        { _id: id },
        {
          $set: data,
        },
        { new: true }
      )
    );
    if (reportError) return [reportError, report];
    return asynchronously(this.ExpensesReport.populateExpenseReport(report));
  }
  async submitReport(id, data) {
    let [reportError, report] = await asynchronously(
      this.ExpensesReport.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            "submission.status": data.decision,
            "submission.submissionDate": Date.now(),
          },
        },
        { new: true }
      )
    );
    if (reportError) return [reportError, report];
    return asynchronously(this.ExpensesReport.populateExpenseReport(report));
  }
  async evaluateReport(id, data) {
    let [reportError, report] = await asynchronously(
      this.ExpensesReport.findOneAndUpdate(
        { _id: id, "created.by": { $ne: data.decisionMaker } },
        {
          $set: {
            "submission.decisionMaker": data.decisionMaker,
            "submission.status": data.decision,
            "submission.decisionDate": Date.now(),
          },
        },
        { new: true, runValidators: true }
      )
    );
    if (reportError) return [reportError, report];
    if (!report)
      return [
        { message: "No pending expense report with that id found." },
        null,
      ];
    return asynchronously(this.ExpensesReport.populateExpenseReport(report));
  }
  async removeReport(id) {
    let [getError, report] = await this.ExpensesReport.findOne({ _id: id });
    await asynchronously(this.ExpensesReport.deleteOne({ _id: id }));
    return [getError, report];
  }
  includeDataToReportFactory(propName) {
    return insertionFactory(propName, this.ExpensesReport);
  }
  updateDataInReportFactory(propName) {
    return updaterFactory(propName, this.ExpensesReport);
  }
  pushDataToReportFactory(propName) {
    return pusherFactory(propName, this.ExpensesReport);
  }
  removeDataFromReportFactory(propName) {
    return removalFactory(propName, this.ExpensesReport);
  }
  async includeExpenseToReport(expenseReportId, data) {
    return this.includeDataToReportFactory("expenses")(expenseReportId, data);
  }
  async updateExpense(expenseReportId, expenseId, data) {
    const { attachments, ...rest } = data;
    let [error, report] = await this.updateDataInReportFactory("expenses")(
      expenseReportId,
      expenseId,
      rest
    );
    if (error) return [error, report];
    return this.pushDataToReportFactory("expenses")(
      expenseReportId,
      expenseId,
      { attachments }
    );
  }
  async removeExpenseFromReport(expenseReportId, expenseId) {
    return this.removeDataFromReportFactory("expenses")(
      expenseReportId,
      expenseId
    );
  }
  async removeAttachmentFromExpenseFromReport(expenseReportId, attachmentId) {
    return this.removeDataFromReportFactory("expenses.$[].attachments")(
      expenseReportId,
      attachmentId
    );
  }
  async includeTravelToReport(expenseReportId, data) {
    return this.includeDataToReportFactory("travels")(expenseReportId, data);
  }
  async updateTravel(expenseReportId, travelId, data) {
    const { attachments, ...rest } = data;
    let [error, report] = await this.updateDataInReportFactory("travels")(
      expenseReportId,
      travelId,
      rest
    );
    if (error) return [error, report];
    return this.pushDataToReportFactory("travels")(expenseReportId, travelId, {
      attachments,
    });
  }
  async removeTravelFromReport(expenseReportId, travelId) {
    return this.removeDataFromReportFactory("travels")(
      expenseReportId,
      travelId
    );
  }
  async removeAttachmentFromTravelFromReport(expenseReportId, attachmentId) {
    return this.removeDataFromReportFactory("travels.$[].attachments")(
      expenseReportId,
      attachmentId
    );
  }
  async includeAccommodationToReport(expenseReportId, data) {
    return this.includeDataToReportFactory("accommodations")(
      expenseReportId,
      data
    );
  }
  async updateAccommodation(expenseReportId, accommodationId, data) {
    const { attachments, ...rest } = data;
    let [error, report] = await this.updateDataInReportFactory(
      "accommodations"
    )(expenseReportId, accommodationId, rest);
    if (error) return [error, report];
    return this.pushDataToReportFactory("accommodations")(
      expenseReportId,
      accommodationId,
      { attachments }
    );
  }
  async removeAccommodationFromReport(expenseReportId, accommodationId) {
    return this.removeDataFromReportFactory("accommodations")(
      expenseReportId,
      accommodationId
    );
  }
  async removeAttachmentFromAccommodationFromReport(
    expenseReportId,
    attachmentId
  ) {
    return this.removeDataFromReportFactory("accommodations.$[].attachments")(
      expenseReportId,
      attachmentId
    );
  }
}
module.exports = ExpensesService;
