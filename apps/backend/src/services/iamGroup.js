const { IMS_POLICIES } = require('@ims-systems-00/ims-core/lib/constants')
const GroupModel = require('../models/mongodb/system/ourIms/iamGroup')
const { IamPolicy } = require('./iamPolicy')
const { logger } = require("@ims-systems-00/ims-core/lib/logger")
class IamGroup extends IamPolicy {
    constructor(connection) {
        super(connection)
        this.connection = connection
    }
    async _buildGroup({ builderName, structure }) {
        try {
            let createdPolicy = await this.createPolicy({
                builderName,
                structure
            })
            return {
                userLicenses: { allocated: 1, used: 0, },
                name: builderName,
                responsibility: 'Manage organisation as a whole.',
                details: { operatingLocation: '' },
                policy: createdPolicy._id
            }
        } catch (err) {
            logger.info(err)
        }
    }
    _saveGroup(group) {
        return new Promise(async (resolve, reject) => {
            try {
                let Group = GroupModel(this.connection)
                let createdGroup = new Group(group)
                await createdGroup.save()
                resolve(createdGroup)
            } catch (err) {
                reject(err)
            }
        })
    }
    async createGroup({ builderName, structure }) {
        let group = await this._buildGroup({ builderName, structure })
        return this._saveGroup(group)
    }
    static isInternalAccess(group) {
        return group.type === 'Internal function'
    }
    async initializeDefaults() {
        try {
            await this.createGroup({
                builderName: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION,
                structure: {}
            })
        } catch (err) {
            logger.info(err)
        }
    }
}
module.exports = IamGroup