const express = require('express');
const router = express.Router();

// auth middlewares ....

const {
    createIamPolicy,
    updateIamPolicy,
    getIamPolicies,
    getIamPolicy,
    deleteIamPolicy,
} = require('../../controllers/iamPolicy');
const { enforceRbac } = require('../../middleware/enforceRbac')
const { IMS_SERVICES, ACTIONS, EFFECTS } = require('@ims-systems-00/ims-core/lib/constants');

router.post('/', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ACCESS_POLICIES,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], createIamPolicy)

router.get('', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ACCESS_POLICIES,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getIamPolicies)

router.get('/:id', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ACCESS_POLICIES,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getIamPolicy)

router.put('/:id', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ACCESS_POLICIES,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], updateIamPolicy)

router.delete('/:id', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ACCESS_POLICIES,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW
    })
], deleteIamPolicy)

module.exports = router
