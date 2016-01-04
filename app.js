var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var client = require("mongodb").MongoClient;
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var sessionRedis = new RedisStore({
  host: 'localhost',
  port: 7000
});

var routes = require('./routes/routing');

var app = express();
global.DB;

// connect to mongodb
client.connect("mongodb://localhost:27017/happygrandrma", function(err, db){
  if(err){
    console.log(err);
  }
  DB = db;
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('rmazzzz'));
app.use(session({
  store: sessionRedis,
  secret: 'rmazzzz',
  cookie: {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

routes(app);

module.exports = app;
