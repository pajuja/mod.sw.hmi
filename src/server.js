// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = 8081;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var i18n = require('i18n-2');
//var cors = require('cors')

// configuration ===============================================================
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url, { useNewUrlParser: true }); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(express.static('public'));
app.use(morgan('combined', { // log only error responses
	skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

i18n.expressBind(app, {
	locales: ['en', 'fi'],
	defaultLocale: 'en',
	extension: '.json',
	cookieName: 'locale',
	devMode: false
});
app.use(function(req, res, next) {
	if(req.query.lang) {
		req.i18n.setLocaleFromQuery();
		res.cookie('locale', req.query.lang);
	} else {
		req.i18n.setLocaleFromCookie();
	}
	next();
});

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'S4l41n3n4v41n', // session secret
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Server started at ' + new Date().toISOString() + ' on port ' + port);