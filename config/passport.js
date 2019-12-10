const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models/index');
const crypto = require('crypto');

module.exports = function () {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'pw',
        session: false,
        passReqToCallback: false
      },
      function (id, password, done) {
        try {
          db.User.findOne({
            where: {
              user_id: id
            }
          }).then(function (user) {
            if (user) {
              return done(null, false, { message: 'user already taken.' });
            } else {
              const salt = buf.toString('base64');
              crypto.pbkdf2(password, salt, 100000, 64, 'sha512', function (err, key) {
                db.User.create({
                  user_id: id,
                  name: data.name,
                  email: data.email,
                  salt: salt,
                  admin: data.is_admin,
                  hashed_password: key.toString('base64'),
                  createdAt: new Date(),
                  updatedAt: null
                }).then(function (result) {
                  res.json(result);
                }).catch(function (err) {
                  if (err.errors[0].path === 'user_id') {
                    res.status(404).json(util.successFalse(err, '아이디 중복'));
                  } else {
                    res.status(404).json(util.successFalse(err, '이메일 중복'));
                  }
                });
              });
            }
          })
        } catch (err) {
          done(err);
        }
      }
    ))

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'pw',
        session: false,
      },
      function (id, password, done) {
        try {
          db.User.findOne({
            where: {
              user_id: id
            }
          }).then(function (user) {
            if (user) {
              crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', function (err, key) {
                if (err) {
                  done(null, false, { message: 'error' });
                }
                if (user.hashed_password === key.toString('base64')) {
                  return done(null, user);
                } else {
                  return done(null, false, { message: 'Password do not match.' });
                }
              });
            } else {
              return done(null, false, { message: 'ID do not match' });
            }
          })
        } catch (err) {
          done(err);
        }
      }
    )
  )

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
        if (key.toString('base64') === user.hashed_password)
          return done(null, user);
        else return done(null, false, { message: '비밀번호가 틀렸습니다.' });
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