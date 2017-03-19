var config = require('./config');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socketio = require('socket.io');

var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

mongoose.connect(config.database);

var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

var io = socketio();
app.io = io;

require('./sockets/socket')(io);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    proxy: true,
    // TODO: Make below work on both dev and live environments
    //cookie : { secure: true },
    store: new MongoStore({
        url: config.database
    })
}));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(allowCrossDomain());

app.set('trust proxy', 1);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./auth/local')(passport);

app.use('/', index);
app.use('/api', api);

app.get('/call', function (req, res, next) {
    io.emit('notification', 'testing');
    res.send(JSON.stringify("Done"))
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
