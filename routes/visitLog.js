const express = require('express');
const router = express.Router();
const db = require('../models/index');
const util = require('../config/util');

router.get('/', util.isLoggedin, function (req, res) {
  const params = req.query;

  const options = {
    where: {},
    include: [{
      model: db.Refugee
    }],
    order: [['updatedAt', 'DESC']]
  };


  const where = {};
  const limit = 10;
  let offset = 0;

  if (params.refugee_id) {
    options.where.refugee_id = params.refugee_id;
  }

  if (params.nationality) {
    options.include[0].where = { nationality: decodeURI(params.nationality) };
  }

  if (params.name) {
    options.include[0].where = { name: decodeURI(params.name) };
  }

  if (params.support) {
    options.where.support = decodeURI(params.support);
  }

  if (params.support_detail) {
    options.where.support_detail = decodeURI(params.support_detail);
  }

  if (params.offset) {
    options.offset = Number.parseInt(params.offset);
    options.limit = 10;
  }

  if (params.st_date && params.ed_date) {
    const stDate = new Date(params.st_date);
    let edDate = new Date(params.ed_date);
    edDate = new Date(edDate.getTime() + (1000 * 60 * 60 * 24) - 1000);

    options.where.createdAt = {
      [db.Operator.between]: [stDate, edDate]
    };
  }

  if (params.st_date && !params.ed_date) {
    const stDate = new Date(params.st_date);
    const oneDay = new Date(stDate.getTime() + (1000 * 60 * 60 * 24) - 1000);

    options.where.createdAt = {
      [db.Operator.between]: [stDate, oneDay]
    };
  }

  if (params.criteria && params.order) {
    if (params.criteria === 'updatedAt') {
      options.order = [[params.criteria, params.order]];
    } else if (params.criteria === 'name' || params.criteria === 'birth' || params.criteria === 'nationality') {
      options.order = [[db.Refugee, params.criteria, params.order], ['updatedAt', 'DESC']];
    } else {
      options.order = [[params.criteria, params.order], ['updatedAt', 'DESC']];
    }
  }

  db.VisitLog.findAndCountAll(options).then(function (result) {
    res.json(result);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

router.get('/:id', util.isLoggedin, function (req, res) {
  db.VisitLog.findOne({
    where: { id: req.params.id }
  }).then(function (results) {
    res.json(results);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

router.post('/', util.isLoggedin, function (req, res) {
  const data = req.body;
  db.VisitLog.create({
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
    refugee_id: data.refugee_id,
    support: data.support,
    support_detail: data.support_detail
  }).then(function (result) {
    res.json(result);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

router.put('/:id', util.isLoggedin, function (req, res) {
  const data = req.body;
  db.VisitLog.update({
    support: data.support,
    support_detail: data.support_detail,
    refugee_id: data.refugee_id,
    updatedAt: new Date()
  }, {
    where: { id: req.params.id }, returning: true
  }).then(function (result) {
    res.json(result);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

router.delete('/:id', util.isLoggedin, util.isAdmin, function (req, res) {
  db.VisitLog.destroy({
    where: { id: req.params.id }
  }).then(function (result) {
    res.json(result);
  }).catch(function (err) {
    res.status(404).json(util.successFalse(err));
  });
});

module.exports = router;
