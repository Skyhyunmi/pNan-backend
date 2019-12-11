const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypyto = require('crypto');
const db = require('../models/index');
const util = require('../config/util');

require('dotenv').config();

router.post('/signup', util.isLoggedin, util.isAdmin, function (req, res) {
  const data = req.body;
  // eslint-disable-next-line handle-callback-err
  crypyto.randomBytes(64, function (err, buf) {
    const salt = buf.toString('base64');
    let hashedPw;
    // eslint-disable-next-line handle-callback-err
    crypyto.pbkdf2(data.pw, salt, 100000, 64, 'sha512', function (err, key) {
      hashedPw = key.toString('base64');
      db.User.create({
        user_id: data.id,
        name: data.name,
        email: data.email,
        salt: salt,
        admin: data.admin,
        hashed_password: hashedPw,
        createdAt: new Date(),
        updatedAt: null
      }).then(function (results) {
        res.json(results);
      }).catch(function (err) {
        if (err.errors[0].path === 'user_id') {
          res.status(403).json(util.successFalse(err, 'ID duplicated.'));
        } else {
          res.status(403).json(util.successFalse(err, 'E-mail Duplicated.'));
        }
      });
    });
  });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (info) return res.status(403).json(util.successFalse(null, info.message));
    if (err || !user) {
      return res.status(403).json(util.successFalse(null, 'ID or PW is not valid', user));
    }
    req.logIn(user, { session: false }, function (err) {
      if (err) return res.status(403).json(util.successFalse(err));
      const payload = {
        id: user.user_id,
        name: user.name,
        admin: user.admin,
        loggedAt: new Date()
      };
      user.authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 90 });
      res.json({ token: user.authToken, admin: user.admin });
    });
  })(req, res, next);
});

router.get('/refresh', util.isLoggedin, function (req, res) {
  db.User.findOne({ where: { user_id: req.decoded.id } }).then(function (user) {
    if (!user) {
      return res.status(400).json({
        message: 'Can\'t refresh the token',
        user: user
      });
    }
    const payload = {
      id: user.user_id,
      name: user.name,
      admin: user.admin,
      loggedAt: new Date()
    };
    user.authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 90 });
    res.json({ token: user.authToken });
  });
});

module.exports = router;
