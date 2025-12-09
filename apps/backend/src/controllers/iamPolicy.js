const {  POLICY_USAGE, IMS_POLICIES, } = require('@ims-systems-00/ims-core/lib/constants')
const IamGroupModel = require('../models/mongodb/system/ourIms/iamGroup')
const IamRoleModel = require('../models/mongodb/system/ourIms/iamRole')
const IamPolicyModel = require('../models/mongodb/system/ourIms/iamPolicy')
const SessionModel = require('../models/mongodb/system/users&auth/session')
const UserModel = require('../models/mongodb/system/users&auth/user')
const { IamPolicyStatements, IamPolicy: PolicyService } = require('../services/iamPolicy')
const { trimQuery } = require('../validations/utils')
const { imsPaginationFormated, Filters } = require('../services/utility')
const { logger } = require("@ims-systems-00/ims-core/lib/logger")

exports.createIamPolicy = async (req, res,next) => {
    let IamPolicy = IamPolicyModel(req.accessControl)
    try {
        let { type, name, accessScope, statement, usedFor } = req.body
        const iamPolicyStatements = new IamPolicyStatements()
        let statements = await iamPolicyStatements.getStatements()
        // if(name===IMS_POLICIES.IMS_COMPLIANCE_FUNCTION||name===IMS_POLICIES.IMS_BUSINESS_FUNCTION)
        //     return res.status(400).json({message:'This name is reserved'})
        statement = [...statements.imsEssentialPolicy, ...statement]
        let createdIamPolicy = new IamPolicy({
            organization: req.accessControl.organisationId,
            name,
            type,
            accessScope,
            statement,
            usedFor
        })
        createdIamPolicy = await createdIamPolicy.save()
        res.status(201).json({ message: 'Policy created successfully', iamPolicy: createdIamPolicy })
    }
    catch (error) {
       next(error)
    }
}
exports.updateIamPolicy = async (req, res,next) => {
    let IamPolicy = IamPolicyModel(req.accessControl)
    let Session = SessionModel(req.accessControl)
    let IamGroup = IamGroupModel(req.accessControl)
    try {
        let { type, name, accessScope, statement } = req.body
        let { id } = req.params
        let updatedIamPolicy = await IamPolicy.findOneAndUpdate({ _id: id }, {
            $set: {
                name,
                type,
                accessScope,
                statement,
            }
        }, { new: true })
        res.status(200).json({ message: 'Policy updated successfully', iamPolicy: updatedIamPolicy })
        let groups = await IamGroup.find({ policy: id })
        await Promise.all(groups.map(group => Session.deleteMany({ current: { group: group._id } })))
    }
    catch (error) {
        next(error)
    }
}
exports.getIamPolicies = async (req, res, next) => {
    let IamPolicy = IamPolicyModel(req.accessControl)
    try {
        let { page, sort, size } = trimQuery(req.query)
        const options = { page, limit: size, sort }
        let filters = new Filters(req, { searchFields: ['reference', 'name'] }).build().query()
        let query = { ...filters, usedFor: POLICY_USAGE.BUSINESS_UNIT, name: { $ne: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION } }
        const pagination = await IamPolicy.paginate(query, options)
        let iamPolicies = pagination.docs
        res.status(200).json({
            message: 'Bulk policies retrived successfully',
            pagination: imsPaginationFormated(pagination),
            iamPolicies
        })
    }
    catch (err) {
       next(err)
    }
}
exports.getIamPolicy = async (req, res, next) => {
    let IamPolicy = IamPolicyModel(req.accessControl)
    try {
        let { id } = req.params
        let iamPolicy = await IamPolicy.findOne({ _id: id })
        res.status(200).json({ message: 'Policy retrived successfully', iamPolicy })
    }
    catch (err) {
        next(err)
    }
}
exports.deleteIamPolicy = async (req, res, next) => {
    let IamPolicy = IamPolicyModel(req.accessControl)
    try {
        let { id } = req.params
        let iamPolicy = await IamPolicy.findOneAndDelete({ _id: id })
        res.status(200).json({ message: 'Policy deleted successfully', iamPolicy })
    }
    catch (err) {
        next(err)
    }
}

exports.policyAdministration = async () => {
    let IamPolicy = IamPolicyModel(req.accessControl)
    try {
        let { groupPolicy, session } = req.accessControl
        await IamPolicy.updateMany({}, {
            $set: { "statement.$[inner].service": "DSPT" }
        }, { arrayFilters: [{ "inner.service": "DSPT NHS Standared" }], new: true })
    } catch (err) {
        logger.info(err)
    }
}