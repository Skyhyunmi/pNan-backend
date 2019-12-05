const express = require('express');
const router = express.Router();
const db = require('../models/index');
const util = require('../config/util');

router.get('/country', util.isLoggedin, function (req, res, next) {
  db.Country_Code.findAll({
  }).then(function (results) {
    res.json(results);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

module.exports = router;