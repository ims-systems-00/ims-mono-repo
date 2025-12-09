const express = require('express');
const { getTenants, getTenant } = require('../../controllers/imsadmin/tenants');
const router = express.Router();

router.post('/', [

], (req, res) => res.send("OK"))

router.put('/:tenant', [

], (req, res) => res.send("OK"))

router.get('/', [

], getTenants)

router.get('/:tenant', [

], getTenant)

module.exports = router