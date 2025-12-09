const { prependStringToObjectProps } = require("./utils");
const { asynchronously } = require("../utility");
const ExpenseReportsModel = require("../../models/mongodb/system/wallet/expenseReports");

/**
 * Append a new object into the array prop of a mongodb document
 * @callback insertionFunction
 * @param {string} reportId - Id of the document to be modified
 * @param {Object} data - Data to be used when creating the object
 * @returns {[Error, Object]} - An array with the first index containing any
 *     errors from the operation and the second index containing the updated
 *     document from the database.
 */

/**
 * Factory that creates an insertion function for pushing data into an array property of a mongodb model
 * @param {string} propName - The name of the array property
 * @param {typeof ExpenseReportsModel} model - The model to be modified
 * @returns {insertionFunction} - The insertion function
 */
exports.insertionFactory = function insertionFactory(propName, model) {
  return async (reportId, data) => {
    let [expenseError, report] = await asynchronously(
      model.findOneAndUpdate(
        { _id: reportId },
        {
          $push: {
            [propName]: data,
          },
        },
        { new: true }
      )
    );
    if (expenseError) return [expenseError, report];
    if (!report)
      return [{ message: "No report was found with the id." }, report];
    return asynchronously(model.populateExpenseReport(report));
  };
};

/**
 * Update an object in the array prop of a mongodb document
 * @callback updaterFunction
 * @param {string} reportId - Id of the document to be modified
 * @param {string} propId - Id of the object in the array to be modified
 * @param {Object} data - Data to be used when updating the object
 * @returns {[Error, Object]} - An array with the first index containing any
 *     errors from the operation and the second index containing the updated
 *     document from the database.
 */

/**
 * Factory that creates an updater function for updating data in an array property of a mongodb model
 * @param {string} propName - The name of the array property
 * @param {typeof ExpenseReportsModel} model - The model to be modified
 * @returns {updaterFunction} - The updater function
 */
exports.updaterFactory = function updaterFactory(propName, model) {
  return async (reportId, propId, data) => {
    let [expenseError, report] = await asynchronously(
      model.findOneAndUpdate(
        { _id: reportId, [propName + "._id"]: propId },
        {
          $set: prependStringToObjectProps(data, propName + ".$."),
        },
        { new: true }
      )
    );
    if (expenseError) return [expenseError, report];
    if (!report)
      return [{ message: "No report was found with the id." }, report];
    return asynchronously(model.populateExpenseReport(report));
  };
};

/**
 * Factory that creates an pusher function for appending data to an array property of a mongodb model
 * @param {string} propName - The name of the array property
 * @param {typeof ExpenseReportsModel} model - The model to be modified
 * @returns {updaterFunction} - The pusher function
 */
exports.pusherFactory = function pusherFactory(propName, model) {
  return async (reportId, propId, data) => {
    let [expenseError, report] = await asynchronously(
      model.findOneAndUpdate(
        { _id: reportId, [propName + "._id"]: propId },
        {
          $push: prependStringToObjectProps(data, propName + ".$."),
        },
        { new: true }
      )
    );
    if (expenseError) return [expenseError, report];
    if (!report)
      return [{ message: "No report was found with the id." }, report];
    return asynchronously(model.populateExpenseReport(report));
  };
};

/**
 * Remove an object from the array prop of a mongodb document
 * @callback removalFunction
 * @param {string} reportId - Id of the document to be modified
 * @param {string} propId - Id of the object in the array to be removed
 * @returns {[Error, Object]} - An array with the first index containing any
 *     errors from the operation and the second index containing the updated
 *     document from the database.
 */

/**
 * Factory that creates a removal function for popping data from an array property of a mongodb model
 * @param {string} propName - The name of the array property
 * @param {typeof ExpenseReportsModel} model - The model to be modified
 * @returns {removalFunction} - The removal function
 */
exports.removalFactory = function removalFactory(propName, model) {
  return async (reportId, propId) => {
    let [reportError, report] = await asynchronously(
      model.findOneAndUpdate(
        { _id: reportId },
        {
          $pull: {
            [propName]: {
              _id: propId,
            },
          },
        },
        { new: true }
      )
    );
    if (reportError) return [reportError, report];
    if (!report)
      return [{ message: "No report was found with the id." }, report];
    return asynchronously(model.populateExpenseReport(report));
  };
};
