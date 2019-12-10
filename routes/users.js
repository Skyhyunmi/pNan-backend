const express = require('express');
const router = express.Router();
const moment = require('moment');
const crypto = require('crypto');
const util = require('../config/util');
const db = require('../models/index');

function getDate(date) {
  if (date) {
    moment(date).format('YYYY-MM-DD HH:mm:ss');
  } else {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }
}

router.get('/', util.isLoggedin, function (req, res) {
  db.User.findAll().then(function (result) {
    res.json(result);
  }).catch(function (err) {
    res.status(500).json(util.successFalse(err));
  });
});

router.get('/:id', util.isLoggedin, util.isAdmin, function (req, res) {
  db.User.findOne({
    where: { id: req.params.id }
  }).then(function (result) {
    if (result) {
      res.json(result);
    } else {
      res.status(404).json(util.successFalse(null, 'there is no user'));
    }
  }).catch(function (err) {
    res.status(500).json(util.successFalse(err));
  });
});

router.put('/:id', util.isLoggedin, util.isAdmin, async function (req, res) {
  const data = req.body;
  const user = await db.User.findOne({
    where: { id: req.params.id }
  });

  let hashedPw = null;
  let salt = null;
  try {
    if (data.new_pw) {
      const buffer = crypto.randomBytes(64);
      salt = buffer.toString('base64');
      const key = crypto.pbkdf2Sync(data.new_pw, salt, 100000, 64, 'sha512');
      hashedPw = key.toString('base64');
    }
  } catch (err) {
    return res.status(500).json(util.successFalse(err));
  }
  let result = null;
  try {
    result = await db.User.update({
      user_id: data.user_id ? data.user_id : user.user_id,
      name: data.name ? data.name : user.name,
      email: data.email ? data.email : user.email,
      admin: data.admin === undefined ? data.admin : user.admin,
      hashed_password: data.new_pw ? hashedPw : user.hashed_password,
      salt: data.new_pw ? salt : user.salt,
      updatedAt: getDate()
    }, {
      where: {
        id: req.params.id
      },
      returning: true
    });
    if (!result[0]) {
      return res.status(400).json(util.successFalse('no column effected'));
    }
  } catch (err) {
    return res.status(500).json(util.successFalse(err));
  }
  res.json(result);
});

router.delete('/:id', util.isLoggedin, util.isAdmin, function (req, res) {
  db.User.findOne({
    where: { id: req.params.id, admin: 0 }
  }).then(function (targetUser) {
    if (!targetUser) {
      res.json(util.successFalse(null, 'no such user or it is admin account'));
    } else {
      db.User.destroy({
        where: { id: targetUser.id }
      }).then(function (result) {
        if (result === 0) {
          res.status(404).json(util.successFalse(null, 'No User is deleted.'));
        } else {
          res.json(util.successTrue(null));
        }
      }).catch(function (err) {
        res.status(404).json(util.successFalse(err));
      });
    }
  }).catch(function (err) {
    res.status(400).json(util.successFalse(err, 'no such user or it is admin account'));
  });
});

module.exports = router;
