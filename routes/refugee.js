const express = require('express');
const router = express.Router();
const db = require('../models/index');
const util = require('../config/util');

router.get('/', util.isLoggedin, function (req, res) {
  const where = {};
  const params = req.query;

  if (params.id) {
    where.id = params.id;
  }
  if (params.name) {
    where.name = decodeURI(params.name);
  }
  if (params.nationality) {
    where.nationality = decodeURI(params.nationality);
  }
  if (params.status) {
    where.status = decodeURI(params.status);
  }
  if (params.sex) {
    where.status = decodeURI(params.status);
  }
  if (params.torture) {
    where.status = decodeURI(params.status);
  }
  if (params.reason) {
    where.status = decodeURI(params.status);
  }
  if (params.st_date && params.ed_date) {
    const stDate = new Date(params.st_date);
    let edDate = new Date(params.ed_date);
    edDate = new Date(edDate.getTime() + (1000 * 60 * 60 * 24) - 1000);

    where.createdAt = {
      [db.Operator.between]: [stDate, edDate]
    };
  }
  if (params.st_date && !params.ed_date) {
    const stDate = new Date(params.st_date);
    const oneDay = new Date(stDate.getTime() + (1000 * 60 * 60 * 24) - 1000);

    where.createdAt = {
      [db.Operator.between]: [stDate, oneDay]
    };
  }

  db.Refugee.findAndCountAll({
    where: where, offset: Number.parseInt(params.offset), limit: Number.parseInt(params.limit)
  }).then(function (result) {
    res.json(result);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

router.get('/:id', util.isLoggedin, function (req, res) {
  db.Refugee.findOne({
    where: { id: req.params.id }
  }).then(function (result) {
    if (!result) res.status(404).json(util.successFalse(null, 'Not valid user id'));
    else res.json(result);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

router.post('/', util.isLoggedin, function (req, res) {
  const data = req.body;
  db.Refugee.create({
    name: data.name,
    birth: data.birth,
    nationality: data.nationality,
    status: data.status,
    sex: data.sex,
    torture: data.torture,
    reason: data.reason,
    memo: data.memo,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  }).then(function (result) {
    res.json(result);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

router.put('/:id', util.isLoggedin, function (req, res) {
  const data = req.body;
  db.Refugee.update({
    name: data.name,
    birth: data.birth,
    nationality: data.nationality,
    status: data.status,
    updatedAt: new Date()
  }, {
    where: { id: req.params.id }, returning: true
  }).then(function (result) {
    if (!result[0]) res.status(404).json(util.successFalse(null, 'Not valid user id'));
    else res.json(result);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

router.delete('/:id', util.isLoggedin, util.isAdmin, function (req, res) {
  db.Refugee.destroy({
    where: { id: req.params.id }
  }).then(function (result) {
    if (!result) res.status(404).json(util.successFalse(null, 'Not valid user id'));
    else res.json(result);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

module.exports = router;
