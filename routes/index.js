var express = require('express');
var passport = require('passport');
var router = express.Router();
var _ = require('lodash');
var Config = require('../config');
var request = require('request');

var backendURL = "http://localhost:3001";

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Login' });
});

router.get('/dashboard', isAuthenticated, function(req, res, next) {
    res.render('user/dashboard', { user : req.user, page_name: 'dashboard' });
});

router.get('/command', isAuthenticated, function(req, res, next) {
   res.render('user/command', { user: req.user, page_name: 'command' });
});

router.get('/heatmap', isAuthenticated, function (req, res, next) {
   res.render('user/report_heatmap', {user: req.user,page_name : 'heatmap'}) ;
});

router.get('/users', isAuthenticated, function(req, res, next) {

    request(backendURL + '/api/users/list', function (error, response, body) {
        var users = '';

        if(!(body == null)) {
            users = JSON.parse(body);
        }

        if (error || response.statusCode !== 200) {
            users = "";
        }

        res.render('user/users', {user: req.user, page_name: 'users', users: users});

    });
});

router.get('/resources', isAuthenticated, function(req, res, next) {

    request(backendURL + '/frontend/resource', function (error, response, body) {
        var resources = '';

        if(!(body == null)) {
            resources = JSON.parse(body);
        }

        if(error || response.statusCode !== 200){
            resources = "";
        }

        res.render('user/resources', { user: req.user, page_name: 'resources', resources: resources});
    });
});

router.get('/incidents', isAuthenticated, function(req, res, next) {

    request(backendURL + '/api/incident/all', function (error, response, body) {
            var incidents = '';

            if(!(body == null)) {
                incidents = JSON.parse(body);
            }

            if (error || response.statusCode !== 200) {
                incidents = "";
            }

            res.render('user/incidents', {user: req.user, page_name: 'incidents', incidents: incidents});
    });
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
