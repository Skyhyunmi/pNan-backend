const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models/index');
const crypyto = require('crypto');

module.exports = function () {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use('local', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: false,
    passReqToCallback: false
  }, function (id, password, done) {
    db.User.findOne({
      where: { user_id: id }
    }).then(function (user) {
      if (!user) return done(null, false, { message: '존재하지 않는 아이디입니다' });
      crypyto.pbkdf2(password, user.salt, 100000, 64, 'sha512', function (err, key) {
        if (key.toString('base64') === user.hashed_password) { return done(null, user); } else return done(null, false, { message: '비밀번호가 틀렸습니다.' });
      });
    }).catch(function (err) {
      return done(err);
    });
  }));

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  function (jwtPayload, done) {
    return db.User.findOneById(jwtPayload.id).then(function (user) {
      return done(null, user);
    }).catch(function (err) {
      return done(err);
    });
  }
  ));
};