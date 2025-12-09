const express = require('express');
const router = express.Router();
const {
    createInvoice,
    getInvoice,
    getInvoices,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    payment,
    downloadInvoice
} = require('../../controllers/invoice')

// auth middlewares ....
const { enforceRbac } = require('../../middleware/enforceRbac')
const { IMS_SERVICES, ACTIONS, EFFECTS } = require('@ims-systems-00/ims-core/lib/constants');

router.post('/', [
    enforceRbac({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], createInvoice)

router.get('/', [
    enforceRbac({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getInvoices)

router.get('/:id', [
    enforceRbac({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW
    })
], getInvoice)

router.put('/:id', [
    enforceRbac({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW
    })
], updateInvoice)

router.delete('/:id', [
    enforceRbac({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW
    })
], deleteInvoice)

router.put('/:id/emails/', [
    enforceRbac({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW
    })
], sendInvoice)

router.put('/:id/payments/', [
    enforceRbac({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW
    })
], payment)

router.get('/:id/downloads/', [
    enforceRbac({
        service: IMS_SERVICES.CRM,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW
    })
], downloadInvoice)

module.exports = router