const express = require('express');
const router = express.Router();
const db = require('../models/index');
const util = require('../config/util');
require('moment-timezone');
const moment = require('moment');

moment.tz.setDefault('Asia/Seoul');

function getDate(date) {
  if (date) {
    moment(date).format('YYYY-MM-DD HH:mm:ss');
  } else {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }
}

router.get('/', util.isLoggedin, function (req, res) {
  const params = req.query;

  const options = {
    where: {},
    order: [['updatedAt', 'DESC']]
  };

  if (params.id) {
    options.where.id = params.id;
  }
  if (params.name) {
    options.where.name = decodeURI(params.name);
  }
  if (params.nationality) {
    options.where.nationality = decodeURI(params.nationality);
  }
  if (params.status) {
    options.where.status = decodeURI(params.status);
  }
  if (params.sex) {
    options.where.sex = decodeURI(params.sex);
  }
  if (params.torture) {
    options.where.torture = decodeURI(params.torture);
  }
  if (params.reason) {
    options.where.reason = decodeURI(params.reason);
  }
  if (params.offset) {
    options.offset = 10 * Number.parseInt(params.offset);
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
    options.order = [[params.criteria, params.order]];
  }
  db.Refugee.findAndCountAll(options).then(function (result) {
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
    createdAt: getDate(),
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
  db.Refugee.findOne({
    where: { id: req.params.id }
  }).then(function (refugee) {
    db.Refugee.update({
      name: data.name ? data.name : refugee.name,
      birth: data.birth ? data.birth : refugee.birth,
      nationality: data.nationality ? data.nationality : refugee.nationality,
      sex: data.sex ? data.sex : refugee.sex,
      torture: data.torture !== null ? data.torture : refugee.torture,
      reason: data.reason ? data.reason : refugee.reason,
      status: data.status ? data.status : refugee.nationality,
      memo: data.memo ? data.memo : refugee.memo,
      updatedAt: getDate()
    }, { where: { id: req.params.id }, returning: true }).then(function (result) {
      if (!result[1]) {
        res.status(404).json(util.successFalse(null, 'Not valid user id'));
      } else {
        res.json(result);
      }
    }).catch(function (err) {
      res.status(404).json(util.successFalse(err));
    });
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
