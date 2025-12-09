const express = require('express');
const router = express.Router();

// auth middlewares ....

const {
    createIamRole,
    updateIamRole,
    getIamRoles,
    getIamRole,
    deleteIamRole,
} = require('../../controllers/iamRole');
const { enforceRbac } = require('../../middleware/enforceRbac')
const { IMS_SERVICES, ACTIONS, EFFECTS } = require('@ims-systems-00/ims-core/lib/constants');

router.post('/', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ROLES,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], createIamRole)
router.get('/', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ROLES,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getIamRoles)
router.get('/:id', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ROLES,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getIamRole)
router.put('/:id', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ROLES,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], updateIamRole)

router.delete('/:id', [
    enforceRbac({
        service: IMS_SERVICES.IAM_ROLES,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW
    })
], deleteIamRole)

module.exports = router
