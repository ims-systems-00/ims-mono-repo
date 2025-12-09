const express = require('express')
const router = express.Router()

const {
    addKpiObjective,
    getKpiObjectives,
    removeKpiObjective,
    updateKpiObjective,
    getKpiObjective
} = require('../../controllers/kpiObjective')

// auth middlewares ....
const { enforceRbac } = require('../../middleware/enforceRbac')
const { IMS_SERVICES, ACTIONS, EFFECTS } = require('@ims-systems-00/ims-core/lib/constants');

router.post('/', [
    enforceRbac({
        service: IMS_SERVICES.MANAGEMENT_REVIEW,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], addKpiObjective)

router.get('/', [
    enforceRbac({
        service: IMS_SERVICES.MANAGEMENT_REVIEW,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getKpiObjectives)

router.get('/:id', [
    enforceRbac({
        service: IMS_SERVICES.MANAGEMENT_REVIEW,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getKpiObjective)

router.put('/:id', [
    enforceRbac({
        service: IMS_SERVICES.MANAGEMENT_REVIEW,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], updateKpiObjective)

router.delete('/:id', [
    enforceRbac({
        service: IMS_SERVICES.MANAGEMENT_REVIEW,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW
    })
], removeKpiObjective)

module.exports = router