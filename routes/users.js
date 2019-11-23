const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypyto = require('crypto');
const db = require('../models/index');

passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
  done(null, user.user_id); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  done(null, user); // 여기의 user가 req.user가 됨
});

passport.use('local', new LocalStrategy({ // local 전략을 세움
  usernameField: 'id',
  passwordField: 'pw',
  session: true, // 세션에 저장 여부
  passReqToCallback: false,
}, (id, password, done) => {
  db.User.findOne({where: { user_id: id }
  }).then((user) => {
    if (user === null) return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 임의 에러 처리
    crypyto.pbkdf2(password, user['salt'],100000,64,'sha512',(err,key) => {
      if(key.toString('base64')===user['hashed_password']) return done(null,user);
      else return done(null,false,{ message: '비밀번호가 틀렸습니다.' });
    });
  }).catch((err) =>{
    return done(err);
  })
}));

/* GET users listing. */
router.post('/join', (req,res) => {
  const data = req.body;
  crypyto.randomBytes(64,(err,buf) => {
    const salt = buf.toString('base64');
    let hashed_pw;
    crypyto.pbkdf2(data['pw'], salt,100000,64,'sha512',(err,key) => {
      hashed_pw=key.toString('base64');
      db.User.create({
        user_id: data['id'],
        name: data['name'],
        email: data['email'],
        salt: salt,
        hashed_password:hashed_pw,
        createdAt: new Date(),
        updatedAt: null
      }).then(function (results) {
        res.json(results);
      }).catch(function (err) {
        res.status(404).send();
      });
    });
  });
  
});
//// id, email, passwd -> hash, name, salt, authToken
router.post('/login', (req,res,next) => {
  passport.authenticate('local',(err,user,info) => {
    if(err) return next(err);
    if(!user) return res.redirect('/login');
    req.logIn(user,(err) => {
      if(err) return next(err);
      return res.json();
    });
  })(req,res,next);
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
