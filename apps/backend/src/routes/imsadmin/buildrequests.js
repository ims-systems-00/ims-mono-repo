const express = require('express');
const { createRequest, getRequests, processRequest, getRequest, deleteRequest } = require('../../controllers/imsadmin/buildrequest');
const router = express.Router();

router.post('/', [

], createRequest)


router.get('/', [

], getRequests)

router.get('/:id', [

], getRequest)

router.put('/:id', [

], processRequest)

router.delete('/:id', [

], deleteRequest)



module.exports = router