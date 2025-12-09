/**
 * Utilization of Fat arrow function is strictly prohibitted for 
 * Developing mongoose plugin.
 */
function runvalidators() {
  this.setOptions({ runvalidators: true })
}
module.exports = function (schema) {
  /**
   * update method is deprecated in mongoose latest versions,
   * hence not used in this method.
   */
  schema.pre('findOneAndUpdate', runvalidators)
  schema.pre('updateMany', runvalidators)
  schema.pre('updateOne', runvalidators)
}