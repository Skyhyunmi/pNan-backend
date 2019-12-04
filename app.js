var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var refugeeRouter = require('./routes/refugee');
var visitLogRouter = require('./routes/visitLog');
var userRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var statRouter = require('./routes/statistic');

var session = require('express-session'); // 세션 설정
var passport = require('passport'); // 여기와
var passportConfig = require('./config/passport');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize()); // passport 구동
passportConfig();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  next();
});
app.use('/api/v1/refugee', refugeeRouter);
app.use('/api/v1/visitlog', visitLogRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/stat', statRouter);
app.use(cors());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
  next();
});

module.exports = app;
