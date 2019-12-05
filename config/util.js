var jwt = require('jsonwebtoken');
const db = require('../models/index');

var util = {};

util.successTrue = function (data) {
  return {
    success: true,
    message: null,
    errors: null,
    data: data
  };
};

util.successFalse = function (err, message, data) {
  if (!err && !message) message = 'data not found';
  return {
    success: false,
    message: message,
    errors: (err) ? util.parseError(err) : null,
    data: data
  };
};

util.parseError = function (errors) {
  var parsed = {};
  if (errors.name === 'ValidationError') {
    for (var name in errors.errors) {
      var validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else if (errors.code === '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message: 'This username already exists!' };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};


// middlewares
util.isLoggedin = function (req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(403).json(util.successFalse(null, 'token is required!'));
  else {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) return res.status(403).json(util.successFalse(err));
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
};

util.isAdmin = function (req, res, next) {
  if (!req.decoded.admin) res.status(403).json(util.successFalse(null, 'Not a Admin'));
  else db.User.findOne({ where: { user_id: req.decoded.id, admin: 1 } })
    .then(function (user) {
      if (!user) res.status(403).json(util.successFalse(null, 'Can\'t find admin'));
      else if (!req.decoded || user.user_id !== req.decoded.id) {
        res.status(403).json(util.successFalse(null, 'You don\'t have permission'));
      }
      else next();
    }).catch(function (err) {
      res.status(403).json(util.successFalse(err));
    });
};

module.exports = util;