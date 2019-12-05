const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypyto = require('crypto');
const util = require('../config/util');
const db = require('../models/index');

router.get('/:id', util.isLoggedin, function(req, res) {
  db.User.findOne({ where: { user_id:req.params.id} })
  .then((result) => {
    if(result) {
      res.json(result);
    }
    else res.status(404).send();
  })
  .catch(() => {
    res.status(404).send();
  })
});

router.put('/:id', util.isLoggedin, function(req, res) {
  var data = req.body;
  if(req.decoded.id !== req.params.id) res.status(403).send();
  else if(data.new_pw){
    crypyto.randomBytes(64, (err, buf) => {
      const salt = buf.toString('base64');
      let hashedPw;
      // eslint-disable-next-line handle-callback-err
      crypyto.pbkdf2(data.new_pw, salt, 100000, 64, 'sha512', (err, key) => {
        hashedPw = key.toString('base64');
        db.User.update({
          name: data.name,
          email: data.email,
          salt: salt,
          hashed_password: hashedPw,
          updatedAt: new Date()
        }, { where: { user_id:req.decoded.id }, returning: true })
        .then(function () {
          db.User.findOne({where: {user_id: req.decoded.id}})
          .then((user) => {
            if(user[0] === 0) res.status(404).send();
            else{
              const payload = {
                id: user.user_id,
                name: user.name,
                admin: user.admin,
                loggedAt: new Date()
              };
              const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 90 });
              user.authToken = token;
              return res.json({ "token": token, "admin": user.admin });
            }
          })
        })
        .catch(function () {
          res.status(404).send();
        });
      });
    });
  }
  else {
    db.User.update({
      name: data.name,
      email: data.email,
      updatedAt: new Date()
    }, { where: { user_id: req.decoded.id }})
    .then(function () {
      db.User.findOne({where: {user_id: req.decoded.id}})
      .then((user) => {
        if(user[0] === 0) res.status(404).send();
        else {
          const payload = {
            id: user.user_id,
            name: user.name,
            admin: user.admin,
            loggedAt: new Date()
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 90 });
          user.authToken = token;
          return res.json({ "token": token, "admin": user.admin });
        }
      })
    }).catch(function () {
      res.status(404).send();
    });
  }
});

router.delete('/:id', util.isLoggedin, util.isAdmin, function(req, res) {
  db.User.findOne({where:{user_id: req.params.id, admin: 0 }})
  .then((rest) =>{
    if(!rest) res.json(util.successFalse(null, '없는 ID거나 관리자 계정입니다.'));
    else db.User.destroy({ where: { user_id: req.params.id } })
    .then(function(result) {
      if(result === 0) res.status(404).send();
      else res.json(result);
    }).catch(function() {
      res.status(404).send();
    });
  })
});

module.exports = router;
