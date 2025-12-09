const express = require('express');
const path = require('path')
const router = express.Router();
router.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, 'serverhealth', 'build', 'index.html'));
});

module.exports = router
