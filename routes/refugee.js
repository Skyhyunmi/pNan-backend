const express = require('express');
const router = express.Router();
const db = require('../models/index');
const util = require('../config/util')

/* GET home page. */
router.get('/', util.isLoggedin,function(req, res) {
  //결과 없을 시 404 필요
  db.Refugee.findAll().then(function (results) {
    //console.log(results);
    if(results.length==0) res.status(404).send();
    else res.json(results);
  }).catch( function(){
    res.status(404).send();
    // res.json(err);
  });
});

router.get('/:id', util.isLoggedin,function(req, res) {
  //결과 없을 시 404 필요
  db.Refugee.findOne({where: {id: req.params.id}}).then(function (results) {
    if(results==null) res.status(404).send();
    else res.json(results);
  }).catch( function(){
    res.status(404).send();
  });
});

router.post('/', util.isLoggedin,function(req, res) {
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
  }).catch(function () {
    res.status(404).send();
    //res.json(err);
  });
});

router.put('/:id', util.isLoggedin,function(req, res) {
  // where 결과 없을 시 404 필요
  const data = req.body;
  db.Refugee.update({
    name: data['name'],
    birth: data['birth'],
    nationality: data['nationality'],
    status: data['status'],
    updatedAt: new Date()
  },{where: {id: req.params.id}, returning: true})
      .then(function (results) {
        //console.log(results[0]);
        if(results[0]===0) res.status(404).send();
        else res.json(results);
      }).catch(function () {
        res.status(404).send();
        //res.json(err);
      });
});

router.delete('/:id', util.isLoggedin,function (req, res) {
  // where 결과 없을 시 404 필요
  db.Refugee.destroy({where: {id: req.params.id}})
      .then(function(result) {
        //console.log(result);
        if(result===0) res.status(404).send();
        else res.json(result);
      }).catch(function() {
        res.status(404).send();
        //res.json(err);
      });
});

module.exports = router;
