const express = require('express');
const router = express.Router();
const db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res) {
  //결과 없을 시 404 필요
  db.Refugee.findAll().then(function (results) {
    res.json(results);
  }).catch( function(err){
    res.json(err);
  });
});

router.get('/:id', function(req, res) {
  //결과 없을 시 404 필요
  db.Refugee.findOne({where: {id: req.params.id}}).then(function (results) {
    res.json(results);
  }).catch( function(err){
    res.json(err);
  });
});

router.post('/', function(req, res) {
  // 400 handling 필요
  const data = req.body;
  db.Refugee.create({
    name: data['name'],
    birth: data['birth'],
    nationality: data['nationality'],
    status: data['status'],
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  }).then(function (results) {
    res.json(results);
  }).catch(function (err) {
    res.json(err);
  });
});

router.put('/:id', function(req, res) {
  // 400 handling 필요, where 결과 없을 시 404 필요
  const data = req.body;
  db.Refugee.update({
    name: data['name'],
    birth: data['birth'],
    nationality: data['nationality'],
    status: data['status'],
    updatedAt: new Date()
  },{where: {id: req.params.id}, returning: true})
      .then(function (results) {
        res.json(results);
      }).catch(function (err) {
        res.json(err);
      });
});

router.delete('/:id', function (req, res) {
  // where 결과 없을 시 404 필요
  db.Refugee.destroy({where: {id: req.params.id}})
      .then(function(result) {
        res.json(result);
      }).catch(function(err) {
        res.json(err);
      });
});

module.exports = router;
