const express = require('express');
const router = express.Router();
const db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res) {
  const where = {};
  const params = req.query;

  if(params.id) {
    where.id = params.id;
  }
  if(params.name) {
    where.name = decodeURI(params.name);
  }
  if(params.nationality) {
    where.nationality = decodeURI(params.nationality);
  }
  if(params.status) {
    where.status = decodeURI(params.status);
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

  db.Refugee.findAll({ where: where }).then(function (results) {
    res.json(results);
  }).catch(function(err) {
    res.json(err);
  });
});

router.get('/:id', function(req, res) {
  // 결과 없을 시 404 필요
  db.Refugee.findOne({ where: { id: req.params.id } }).then(function (results) {
    res.json(results);
  }).catch(function(err) {
    res.json(err);
  });
});

router.post('/', function(req, res) {
  // 400 handling 필요
  const data = req.body;
  db.Refugee.create({
    name: data.name,
    birth: data.birth,
    nationality: data.nationality,
    status: data.status,
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
  // where 결과 없을 시 404 필요
  const data = req.body;
  db.Refugee.update({
    name: data.name,
    birth: data.birth,
    nationality: data.nationality,
    status: data.status,
    updatedAt: new Date()
  }, { where: { id: req.params.id }, returning: true })
    .then(function (results) {
      res.json(results);
    }).catch(function (err) {
      res.json(err);
    });
});

router.delete('/:id', function (req, res) {
  // where 결과 없을 시 404 필요
  db.Refugee.destroy({ where: { id: req.params.id } })
    .then(function(result) {
      res.json(result);
    }).catch(function(err) {
      res.json(err);
    });
});

module.exports = router;
