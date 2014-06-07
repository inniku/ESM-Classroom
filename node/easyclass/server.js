// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var appt     = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var tpassport = require('passport');
var flash    = require('connect-flash');
//var path = require('path');
//var favicon = require('static-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');

// New Code
//var mongo = require('mongodb');
//var monk = require('monk');
//var db = monk('localhost:27017/easyclass');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
//require('./config/tpassport')(tpassport);
require('./config/tpassport', './config/passport')(passport, tpassport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	//app.use(passport_teacher.initialize());
	//app.use(passport_teacher.session());


	app.use(passport.initialize(), tpassport.initialize());
	app.use(passport.session(), tpassport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

	//app.use(express.session({ secret: 'teachersessionnnnnnnnnnnnnnnnn' })); // session secret
	 // persistent login sessions
	//app.use(flash());

});


/*appt.configure(function() {

	// set up our express application
	appt.use(express.logger('dev')); // log every request to the console
	appt.use(express.cookieParser()); // read cookies (needed for auth)
	appt.use(express.bodyParser()); // get information from html forms

	appt.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	appt.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	//app.use(passport_teacher.initialize());
	//app.use(passport_teacher.session());


	appt.use(tpassport.initialize());
	appt.use(tpassport.session()); // persistent login sessions
	appt.use(flash()); // use connect-flash for flash messages stored in session

	//app.use(express.session({ secret: 'teachersessionnnnnnnnnnnnnnnnn' })); // session secret
	 // persistent login sessions
	//app.use(flash());

});*/


// routes ======================================================================
require('./app/routes.js')(app, passport, tpassport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
