var jwt = require('jsonwebtoken');

var util = {};

util.successTrue = function(data) {
  return {
    success: true,
    message: null,
    errors: null,
    data: data
  };
};

util.successFalse = function(err, message) {
  if(!err && !message) message = 'data not found';
  return {
    success: false,
    message: message,
    errors: (err) ? util.parseError(err) : null,
    data: null
  };
};

util.parseError = function(errors) {
  var parsed = {};
  if(errors.name === 'ValidationError') {
    for(var name in errors.errors) {
      var validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else if(errors.code === '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message: 'This username already exists!' };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};


// middlewares
util.isLoggedin = function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) return res.json(util.successFalse(null, 'token is required!'));
  else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if(err) return res.json(util.successFalse(err));
      else{
        req.decoded = decoded;
        next();
      }
    });
  }
};

util.isAdmin = function(req, res, next) {
  if(!req.decoded.admin) res.status(403).send();
  db.User.findOne({where: { user_id: req.decoded.id, admin: 1 } })
  .then((user) =>{
    if(!user) res.status(403).send();
    else if(!req.decoded || user.user_id !== req.decoded.id) {
      res.json(util.successFalse(null, 'You don\'t have permission')); }
    else next();
  })
  .catch(function() {
    res.status(404).send();
  });
};

module.exports = util;