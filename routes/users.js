const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypyto = require('crypto');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const util = require('../config/util')
/* GET users listing. */
router.get('/', util.isLoggedin,function(req, res, next) {
  res.send('respond with a resource');
});

/* GET user profile. */
router.get('/profile', util.isLoggedin,function(req, res, next) {
    res.send(req.user);
});

module.exports = router;
