const express = require('express')
const router = express.Router()
const {
    createCalenderEvent,
    getCalenderEvents,
    getCalenderEvent,
    editCalenderEvent,
    removeCalenderEvent
} = require('../../controllers/calenderEvent')

// auth middlewares ....
const { enforceRbac } = require('../../middleware/enforceRbac')
const { IMS_SERVICES, ACTIONS, EFFECTS } = require('@ims-systems-00/ims-core/lib/constants');

router.post('/', [
    enforceRbac({
        service: IMS_SERVICES.CALENDAR,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })

], createCalenderEvent)

router.get('/', [
    enforceRbac({
        service: IMS_SERVICES.CALENDAR,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })

], getCalenderEvents)

router.get('/:id', [
    enforceRbac({
        service: IMS_SERVICES.CALENDAR,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getCalenderEvent)

router.put('/:id', [
    enforceRbac({
        service: IMS_SERVICES.CALENDAR,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], editCalenderEvent)

router.delete('/:id', [
    enforceRbac({
        service: IMS_SERVICES.CALENDAR,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW
    })

], removeCalenderEvent)

module.exports = router