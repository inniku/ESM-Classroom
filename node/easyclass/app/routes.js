
module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// ADMIN PROFILE SECTION =========================
	app.get('/administratorprofile', isLoggedIn, function(req, res) {
		res.render('adminprofile.ejs', {
			user : req.user
		});
	});
	app.get('/teacherprofile', isLoggedIn, function(req, res) {
		res.render('teacherprofile.ejs', {
			user : req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/logout2', function(req, res) {
		req.logout();
		res.redirect('/signupuser');
	});

	app.get('/createclass', isLoggedIn, function(req, res){

		res.render('createclass.ejs', { user: req.user});
	});
	
	// PULL COLLECTION LIST IN DATABASE


	// CREATE CLASS FOR USER
	app.post('/createclass', function(req, res){
		var className = req.body.classname;
		var MongoClient = require('mongodb').MongoClient
    	, format = require('util').format;

		MongoClient.connect('mongodb://127.0.0.1:27017/easyclass', function(err, db) {
    	if(err) throw err;

    	var collection = db.collection(className);
    	collection.insert({name:2}, function(err, docs) {
       		 collection.count(function(err, count) {
            	console.log(format("count = %s", count));
        });
    });

    // Locate all the entries using find
    collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
        res.redirect('/createclass');
    		});
		});

	});

// SIGNUP FOR USER ==============================
	app.get('/signupuser', isLoggedIn, function(req, res) {
		res.render('signupuser.ejs', { user: req.user});		
	});

	/*app.post('/signupteacher', function(req, res){
		var teacherEmail = req.body.teacheremail;
		var teacherPass = req.body.teacherpass;
		var MongoClient = require('mongodb').MongoClient
    	, format = require('util').format;

		MongoClient.connect('mongodb://127.0.0.1:27017/easyclass', function(err, db) {
    	if(err) throw err;
    	
    	var collection = db.collection("teachers");
    	collection.insert({
        "email" : teacherEmail,
        "password" : teacherPass
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
         //collection.insert({ "email" : teacherEmail, "password" : teacherPass })
        // res.send("complete");
     
        res.redirect('/signupuser');
        }
    
    });
    });	
	});*/

		app.post('/signupteacher', passport.authenticate('teacher-signup', {
			successRedirect : '/signupuser', // redirect to the secure profile section
			failureRedirect : '/', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	app.post('/signupstudent', function(req, res){
		var studentEmail = req.body.studentemail;
		var studentPass = req.body.studentpass;
		var MongoClient = require('mongodb').MongoClient
    	, format = require('util').format;

		MongoClient.connect('mongodb://127.0.0.1:27017/easyclass', function(err, db) {
    	if(err) throw err;
    	
    	var collection = db.collection("students");
    	collection.insert({
        "email" : studentEmail,
        "password" : studentPass
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
         //collection.insert({ "email" : teacherEmail, "password" : teacherPass })
        // res.send("complete");
     
        res.redirect('/signupuser');
        }
    
    });
    });	
	});


	//MANAGE CLASSES
	app.get('/manageclass', isLoggedIn, function(req, res){
		res.render('manageclass.ejs', { user: req.user});
	});


	app.post('/manageclass', function(req, res){
		var Items = db.getCollection('users');
		if(db.isClient){
			
				return Items.find();
			
		}
		res.send(Items.find());

	});
	//app.get('showsuccess', isSuccess)
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// ADMINISTRATOR LOGIN ===============================
		// show the login form
		app.get('/administratorlogin', function(req, res) {
			res.render('adminlogin.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/administratorlogin', passport.authenticate('local-login', {
			successRedirect : '/administratorprofile', // redirect to the secure profile section
			failureRedirect : '/administratorlogin', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// TEACHER LOGIN ===============================
		app.get('/teacherlogin', function(req, res) {
			res.render('teacherlogin.ejs', { message: req.flash('loginMessage') });
		});

			app.post('/teacherlogin', passport.authenticate('teacher-login', {
			successRedirect : '/teacherprofile', // redirect to the secure profile section
			failureRedirect : '/teacherlogin', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));


		// STUDENTLOGIN
		app.get('/studentlogin', function(req, res) {
			res.render('studentlogin.ejs', { message: req.flash('loginMessage') });
		});

			app.post('/studentlogin', passport.authenticate('student-login', {
			successRedirect : '/studentprofile', // redirect to the secure profile section
			failureRedirect : '/studentlogin', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP FOR ADMINISTRATOR =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/administratorprofile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));


	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});


};

function createClass(req, res, next){
	if (req.isAuthenticated())
		
		var configDB = require('./config/database.js');
		var mongoose = require('mongoose');
		mongoose.connect(configDB.url); 
		mongoose.createCollection("VEDA", { capped : true, size : 5242880, max : 5000 } )
		res.redirect('/');
		return next();
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}


