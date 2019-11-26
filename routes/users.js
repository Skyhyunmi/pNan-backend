const express = require('express');
const router = express.Router();
const util = require('../config/util');
/* GET users listing. */
router.get('/', util.isLoggedin, function(req, res) {
  res.send('respond with a resource');
});

/* GET user profile. */
router.get('/profile', util.isLoggedin, function(req, res) {
  res.send(req.user);
});

module.exports = router;
