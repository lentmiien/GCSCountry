require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const pp = require('./passport_init');

var indexRouter = require('./routes/index');
var mypageRouter = require('./routes/mypage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 86400000 } }));
app.use(pp.passport.initialize());
app.use(pp.passport.session());

app.use('/', indexRouter);
app.use('/login', requireNotAuthenticated, pp.router);
app.use('/mypage', requireAuthenticated, mypageRouter);

app.post('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

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
  res.render('error', { role: req.user != undefined ? req.user.role : 'guest' });
});

// Autenthication checks
function requireAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
function requireNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/mypage');
  }
  next();
}

module.exports = app;
