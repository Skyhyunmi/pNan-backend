const express = require('express');
const router = express.Router();
const db = require('../models/index');
const util = require('../config/util');

router.get('/country', (req,res,next) => {
    db.Country_Code.findAll({}).then(function (results) {
        res.json(results);
      }).catch(function() {
        res.status(404).send();
      });
});

module.exports = router;