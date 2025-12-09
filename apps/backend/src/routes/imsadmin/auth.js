const express = require('express');
const router = express.Router();
const { register, signIn, signOut } = require('../../controllers/imsadmin/auth');

router.post('/signup', [

], register)

router.post('/signin', [
    
], signIn)

router.delete('/signout', [

], signOut)

module.exports = router