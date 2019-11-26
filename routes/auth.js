const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypyto = require('crypto');
const db = require('../models/index');
const util = require('../config/util')
require('dotenv').config();

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
        }).catch(function () {
          res.status(404).send();
        });
      });
    });
    
  });
  //// id, email, passwd -> hash, name, salt, authToken
  router.post('/login', (req,res,next) => {
    passport.authenticate('local',{session:false},(err,user) => {
      if (err || !user) {
        return res.status(400).json({
            message: 'ID or PW is not valid',
            user   : user
        });
      }
      req.logIn(user,{session:false},(err) => {
        if(err) return res.send(err);
        let payload = {
          id:user.user_id,
          name:user.name
        };
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: 60*90});
        user.authToken = token;
        return res.json({token});
      });
    })(req,res,next);
  });
  
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/refresh',util.isLoggedin,function(req,res){
    db.User.findAll({where:{user_id:req.decoded.id}}).then(function(result){
      
      if (!result) {
        
        return res.status(400).json({
            message: 'Can\'t refresh the token',
            user   : result
        });
      }
      let payload = {
        id:result.user_id,
        name:result.name
      };
      const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: 60*90});
      result.authToken = token;
      return res.json({token});
    })
  })
module.exports = router;
