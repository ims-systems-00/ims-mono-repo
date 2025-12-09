const UserModel = require('../models/mongodb/system/users&auth/user')
const { asyncWrapper } = require('./utility')
const ExpensesModel = require('../models/mongodb/system/wallet/expenses')
const ExpenseReportsModel = require('../models/mongodb/system/wallet/expenseReports')

class PdpAndFormsService {
  constructor(connection) {
    super(connection)
    this.connection = connection
    this.User = UserModel(connection)
    this.Expenses = ExpensesModel(connection)
    this.ExpensesReport = ExpenseReportsModel(connection)
  }
  async createFormReference(data) {
    let [expense, expenseError] = await asyncWrapper(() =>
      this.Expenses.create({
        user: data.createdBy,
        type: data.type,
        amount: data.amount,
        notes: data.notes,
        created: { by: data.createdBy, on: Date.now() }
      })
    )
    if (expenseError) return [expense, expenseError]
    return asyncWrapper(() => this.Expenses.populateExpense(expense))
  }
  async getFormReferences(query) {
    let [expenses, expensesError] = await asyncWrapper(() => this.Expenses.find(query))
    if (expensesError) return [expenses, expensesError]
    return asyncWrapper(() => Promise.all(expenses.map(expense => this.Expenses.populateExpense(expense))))
  }
  async getFormReference(id) {
    let [expense, expenseError] = await asyncWrapper(() => this.Expenses.findOne({ _id: id }))
    if (expenseError) return [expense, expenseError]
    return asyncWrapper(() => this.Expenses.populateExpense(expense))
  }
  async updateFormReference(data) {

  }
  async deleteFormReference(id) {
    let [expense, expenseError] = await asyncWrapper(() => this.Expenses.findOneDelete({ _id: id }))
    if (expenseError) return [expense, expenseError]
    return asyncWrapper(() => this.Expenses.populateExpense(expense))
  }
  async createForm(data) {

  }
  async updateForm(data) {

  }
  async getForms(data) {

  }
  async getForm(data) {

  }
  async removeForm(data) {

  }
}
module.exports = PdpAndFormsService