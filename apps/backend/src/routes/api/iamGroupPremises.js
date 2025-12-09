const express = require('express');
const router = express.Router();

// auth middlewares ....

const {
    createIamGroupPremise,
    getIamGroupPremise,
    getIamGroupPremises,
    updateIamGroupPremise,
    deleteIamGroupPremise,
    attachGroup,
} = require('../../controllers/iamGroupPremise');
const { enforceRbac } = require('../../middleware/enforceRbac')
const { IMS_SERVICES, ACTIONS, EFFECTS } = require('@ims-systems-00/ims-core/lib/constants');

router.post('/', [
    enforceRbac({
        service: IMS_SERVICES.IAM_PREMISES,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], createIamGroupPremise)
router.get('/', [
    enforceRbac({
        service: IMS_SERVICES.IAM_PREMISES,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getIamGroupPremises)
router.get('/:id', [
    enforceRbac({
        service: IMS_SERVICES.IAM_PREMISES,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getIamGroupPremise)
router.put('/:id', [
    enforceRbac({
        service: IMS_SERVICES.IAM_PREMISES,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], updateIamGroupPremise)

router.delete('/:id', [
    enforceRbac({
        service: IMS_SERVICES.IAM_PREMISES,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW
    })
], deleteIamGroupPremise)

router.post('/:id/policies/', [
    enforceRbac({
        service: IMS_SERVICES.IAM_PREMISES,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], attachGroup)

module.exports = router
