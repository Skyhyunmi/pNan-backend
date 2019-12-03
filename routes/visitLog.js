const express = require('express');
const router = express.Router();
const db = require('../models/index');
const util = require('../config/util');

router.get('/', util.isLoggedin, function(req, res) {
  const params = req.query;

  const where = {};
  const include = [{
    model: db.Refugee
  }];

  if(params.refugee_id) {
    where.refugee_id = params.refugee_id;
  }

  if(params.nationality) {
    include[0].where = { nationality: decodeURI(params.nationality) };
  }

  if(params.name) {
    include[0].where = { name: decodeURI(params.name) };
  }

  if(params.support) {
    where.support = decodeURI(params.support);
  }

  if(params.support_detail) {
    where.support_detail = decodeURI(params.support_detail);
  }

  if(params.st_date && params.ed_date) {
    const stDate = new Date(params.st_date);
    let edDate = new Date(params.ed_date);
    edDate = new Date(edDate.getTime() + (1000 * 60 * 60 * 24) - 1000);

    where.createdAt = {
      [db.Operator.between]: [stDate, edDate]
    };
  }

  if(params.st_date && !params.ed_date) {
    const stDate = new Date(params.st_date);
    const oneDay = new Date(stDate.getTime() + (1000 * 60 * 60 * 24) - 1000);

    where.createdAt = {
      [db.Operator.between]: [stDate, oneDay]
    };
  }
  db.VisitLog.findAll({ where: where, include: include }).then(function (results) {
    res.json(results);
  }).catch(function(err) {
    res.json(err);
  });
});

router.get('/:id', util.isLoggedin, function(req, res) {
  db.VisitLog.findOne({ where: { id: req.params.id } }).then(function (results) {
    res.json(results);
  }).catch(function() {
    res.status(404).send();
  });
});

router.post('/', util.isLoggedin, function(req, res) {
  const data = req.body;
  db.VisitLog.create({
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
    refugee_id: data.refugee_id,
    support: data.support,
    support_detail: data.support_detail
  }).then(function (results) {
    res.json(results);
  }).catch(function (err) {
    res.json(err);
  });
});

router.put('/:id', util.isLoggedin, function(req, res) {
  const data = req.body;
  db.VisitLog.update({
    support: data.support,
    refugee_id: data.refugee_id,
    updatedAt: new Date()
  }, { where: { id: req.params.id }, returning: true })
    .then(function (results) {
      res.json(results);
    }).catch(function () {
      res.status(404).send();
    });
});

router.delete('/:id', util.isLoggedin, function (req, res) {
  db.VisitLog.destroy({ where: { id: req.params.id } })
    .then(function(result) {
      res.json(result);
    }).catch(function() {
      res.status(404).send();
    });
});

module.exports = router;
