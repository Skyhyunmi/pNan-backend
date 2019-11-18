const express = require('express');
const router = express.Router();
const db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res) {
    db.VisitLog.findAll().then(function (results) {
        res.json(results);
    }).catch( function(err){
        res.json(err);
    });
});

router.get('/:id', function(req, res) {
    db.VisitLog.findOne({where: {id: req.params.id}}).then(function (results) {
        res.json(results);
    }).catch( function(err){
        res.json(err);
    });
});

router.post('/', function(req, res) {
    const data = req.body;
    db.VisitLog.create({
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        refugee_id: data['refugee_id'],
        support: data['support']
    }).then(function (results) {
        res.json(results);
    }).catch(function (err) {
        res.json(err);
    })
});

router.put('/:id', function(req, res) {
    // 400 handling 필요, where 결과 없을 시 404 필요
    const data = req.body;
    db.VisitLog.update({
        support: data['support'],
        refugee_id: data['refugee_id'],
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
    db.VisitLog.destroy({where: {id: req.params.id}})
        .then(function(result) {
            res.json(result);
        }).catch(function(err) {
            res.json(err);
    });
});

module.exports = router;
