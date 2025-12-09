const { ROLE_TYPES } = require('@ims-systems-00/ims-core/lib/constants')
const RoleModel = require('../models/mongodb/system/ourIms/iamRole')
const { IamPolicy } = require('./iamPolicy')
const { logger } = require("@ims-systems-00/ims-core/lib/logger")

class IamRole extends IamPolicy {
    constructor(connection) {
        super(connection)
        this.connection = connection
    }
    async _buildRole({ builderName, structure }) {
        try {
            let createdPolicy = await this.createPolicy({
                builderName,
                structure
            })
            return {
                name: builderName,
                type: ROLE_TYPES.PREMITIVE,
                policy: createdPolicy._id
            }
        } catch (err) {
            logger.info(err)
        }
    }
    _saveRole(role) {
        return new Promise(async (resolve, reject) => {
            try {
                let Role = RoleModel(this.connection)
                let createdRole = new Role(role)
                await createdRole.save()
                resolve(createdRole)
            } catch (err) {
                reject(err)
            }
        })
    }
    _removeRole(roleId) {
        return new Promise(async (resolve, reject) => {
            try {
                let Role = RoleModel(this.connection)
                let deletedRole = await Role.findOneAndDelete({ _id: roleId })
                await this.deletePolicy(deletedRole.policy)
                resolve(deletedRole)
            } catch (err) {
                reject(err)
            }
        })
    }
    async createRole({ builderName, structure }) {
        let role = await this._buildRole({ builderName, structure })
        return this._saveRole(role)
    }
    deleteRole(roleId) {
        return this._removeRole(roleId)
    }
    async initializeDefaults() {
        try {

        } catch (err) {
            logger.info(err)
        }
    }
}
module.exports = IamRole