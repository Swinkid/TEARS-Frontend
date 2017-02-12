var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Login' });
});

router.get('/dashboard', isAuthenticated, function(req, res, next) {
    res.render('user/dashboard', { user : req.user, page_name: 'dashboard' });
});

router.get('/command', isAuthenticated, function(req, res, next) {
   res.render('user/command', { user: req.user, page_name: 'command' });
});

router.post('/', passport.authenticate('login', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
}));

router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

module.exports = router;

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
