const express = require('express');
const router = express.Router();
const db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res) {
  db.Refugee.findAll().then(function (results) {
    res.json(results);
  }).catch( function(err){
    res.json(err);
  });
});
router.post('/', function(req, res) {
  const data = req.body;
  db.Refugee.create({
    name: data['name'],
    birth: new Date(),
    nationality: data['nationality'],
    status: data['status'],
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  }).then(function (results) {
    res.json(results);
  }).catch(function (err) {
    res.json(err);
  })
});
module.exports = router;
