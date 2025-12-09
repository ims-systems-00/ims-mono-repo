let RisksModel = require('../models/mongodb/system/riskManagement/risk')
const IamGroup = require('./iamGroup')
const { IamPolicy } = require('./iamPolicy')
const IamRole = require('./iamRole')
const { asyncWrapper } = require('./utility')

class RiskManagementService {
    constructor(connection) {
        this.connection = connection
        this.Risks = RisksModel(connection)
    }
}



module.exports = RiskManagementService