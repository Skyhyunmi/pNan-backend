const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models/index');
const crypto = require('crypto');

module.exports = function () {
  passport.use(
    'signup',
    new LocalStrategy({
      usernameField: 'id',
      passwordField: 'pw',
      session: false,
      passReqToCallback: true
    },
    function (req, id, password, done) {
      try {
        db.User.findOne({
          where: {
            user_id: id
          }
        }).then(function (user) {
          const data = req.body;
          if (user) {
            return done(null, false, { message: 'User already exist.' });
          }
          db.User.findOne({
            where: {
              email: data.email
            }
          }).then(function (user) {
            if (user) {
              return done(null, false, { message: 'E-mail duplicated.' });
            }
            const buffer = crypto.randomBytes(64);
            const salt = buffer.toString('base64');
            const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
            const hashedPw = key.toString('base64');
            db.User.create({
              user_id: id,
              name: data.name,
              email: data.email,
              salt: salt,
              admin: data.is_admin,
              hashed_password: hashedPw,
              createdAt: new Date(),
              updatedAt: null
            }).then(function (result) {
              done(null, result);
            }).catch(function (err) {
              done(err);
            });
          });
        });
      } catch (err) {
        done(err);
      }
    }
    )
  );

  passport.use(
    'login',
    new LocalStrategy({
      usernameField: 'id',
      passwordField: 'pw',
      session: false
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
        });
      } catch (err) {
        done(err);
      }
    }
    )
  );

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