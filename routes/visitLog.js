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

module.exports = router;
