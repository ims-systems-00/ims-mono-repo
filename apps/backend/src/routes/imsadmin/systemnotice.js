const express = require('express');
const { sendNotice } = require('../../controllers/imsadmin/systemnotice');
const router = express.Router();

router.post('/', [

], sendNotice)


module.exports = router