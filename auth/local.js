var Strategy = require('passport-local').Strategy;
var User = require('../models/user');

var LOGIN_ERROR = "Wrong username or password.";

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('signup', new Strategy({
        username: 'username',
        password: 'password',
        passReqToCallback: true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            User.findOne({ 'local.username':  username }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That user already exists.'));
                } else {
                    var tempUser = new User();

                    tempUser.username = username;
                    tempUser.email = req.body.email;
                    tempUser.password = tempUser.generateHash(password);
                    tempUser.firstname = req.body.firstname;
                    tempUser.lastname = req.body.lastname;
                    tempUser.jobtitle = req.body.jobtitle;
                    tempUser.avatar = "//placehold.it/150x150";

                    tempUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, tempUser);
                    });
                }
            });
        });
    }));

    passport.use('login', new Strategy({
        username: 'username',
        password: 'password',
        passReqToCallback: true
    }, function(req, username, password, done) {
        User.findOne({ 'username':  username }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', LOGIN_ERROR));
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', LOGIN_ERROR));
            return done(null, user);
        });
    }));
};