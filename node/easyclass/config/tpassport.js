// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load up the user model

var Teacher      = require('../app/models/teacher');
var Student      = require('../app/models/student');
// load the auth variables
var configAuth = require('./auth'); // use this one for testing


module.exports = function(tpassport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    tpassport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    tpassport.deserializeUser(function(id, done) {
        Teacher.findById(id, function(err, user) {
            done(err, user);
        });
    });
   
    // =========================================================================
    // TEACHER LOGIN ===========================================================
    // =========================================================================
    tpassport.use('teacher-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            Teacher.findOne({ 'local.email' :  email }, function(err, user) {
               
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

};
