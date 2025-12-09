let CQCToolModel = require("../models/mongodb/system/cqc/cqcTool");
const { asyncWrapper } = require("./utility");
class Compliance {
  constructor(connection) {
    this.connection = connection;
    this.CQCTool = CQCToolModel(connection);
  }
  async buildCqcTool(group) {
    // let Compliance = ComplianceModel(this.connection)
    // let [tool, toolError] = await asyncWrapper(
    //     () => Compliance.findOne({ name: 'cqcTool' })
    // )
    // if (!tool) return [tool, toolError]
    // let CQCTool = CQCToolModel(this.connection)
    // let [alreadyHave, alreadyhaveError] = await asyncWrapper(() => CQCTool.findOne({ group }))
    // if (alreadyHave) return [null, { message: 'This tool already exists for this unit' }]
    // tool = tool.module.map(module => new CQCTool({
    //     group: group,
    //     clause: module.clause,
    //     isLocked: module.isLocked,
    //     parentClause: module.parentClause,
    //     kloe: module.kloe,
    //     compliancePercentage: module.compliancePercentage,
    //     numberOfCompliantChildren: module.numberOfCompliantChildren,
    //     appliesTo: module.appliesTo
    // }))
    // return asyncWrapper(
    //     () => Promise.all(tool.map(t => t.save()))
    // )
  }
  async getCqcTool(group) {
    let CQCTool = CQCToolModel(this.connection);
    return asyncWrapper(() => CQCTool.find({ group }));
  }
  async getControl(id) {
    return asyncWrapper(() => this.CQCTool.findOne({ _id: id }));
  }
}

module.exports = Compliance;
