const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models/index');
const crypyto = require('crypto');

module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });
      
  passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    done(null, user); // 여기의 user가 req.user가 됨
  });
      
  passport.use('local', new LocalStrategy({ // local 전략을 세움
    usernameField: 'id',
    passwordField: 'pw',
    session: false, // 세션에 저장 여부
    passReqToCallback: false
  }, (id, password, done) => {
    db.User.findOne({ where: { user_id: id } }).then((user) => {
      if (!user) return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 임의 에러 처리
      crypyto.pbkdf2(password, user.salt, 100000, 64, 'sha512', (err, key) => {
        if(key.toString('base64') === user.hashed_password) return done(null, user);
        else return done(null, false, { message: '비밀번호가 틀렸습니다.' });
      });
    }).catch((err) => {
      return done(err);
    });
  }));

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  function (jwtPayload, done) {
    return db.User.findOneById(jwtPayload.id)
      .then((user) => {
        return done(null, user);
      }).catch((err) => {
        return done(err);
      });
  }
  ));
};