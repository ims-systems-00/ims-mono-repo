const express = require('express');
const router = express.Router();

const { createTicket, getTicket, getTickets } = require('../../controllers/jiraIntegration')

router.post('/', [

], createTicket)

router.get('/', [

], getTickets)

router.get('/:id', [

], getTicket)

module.exports = router
