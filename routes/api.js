var express = require('express');
var passport = require('passport');
var router = express.Router();
var Config = require('../config');
var http = require('http');
var request = require('request');
var _ = require('lodash');

var GOOGLE_DISTANCE_MATRIX_KEY = "&key=AIzaSyATLPcyfRfm_eCIlPIHojG5jHmXcEGfGQE";
var GOOGLE_DISTANCE_MATIRIX_URL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial";

router.get('/test', function(req, res, next){

});

router.get('/resources', function(req, res, next) {

    var requestOptions = {

    };

    console.log(req.query);

    request({url: "http://localhost:3001/frontend/resource", qs : req.query, json: true}, function (err, response, body) {
            _.forEach(body, function (d) {
                d['lastUpdated'] = new Date().getTime() - d['lastUpdated'];
            });

            res.json(body);
    });
});

router.post('/incident/new', isAuthenticated, function (req, res, next) {
    var formData = {
        location: req.body.location,
        type : req.body.type,
        status: req.body.status,
        priority : req.body.priority,
        details : req.body.details
    };

    request.post({url: 'http://localhost:3001/api/incident/add', form: formData}, function (err, httpResponse, body) {
       if(!err){
           var returnData = {
               id : body.replace(/['"]+/g, '')
           };

           res.json(returnData);
       }
    });
});

router.post('/warning/new', isAuthenticated, function (req, res, next) {
    var formData = {
        location: req.body.location,
        type: req.body.type,
        details: req.body.details
    };

    request.post({url: 'http://localhost:3001/api/warning/new', form: formData}, function (err, httpResponse, body) {
        if(!err){
           res.json(body);
        }
    });
});

router.post('/warning/get', isAuthenticated, function (req, res, next) {
    var formData = {
        location: req.body.location
    };

    request.post({url: 'http://localhost:3001/api/warning', form: formData}, function (err, httpResponse, body) {
        if(!err){
            res.json(body);
        }
    });
});

router.get('/incident/travel', isAuthenticated, function (req, res, next) {

    var start = req.query.start;
    var end = req.query.end;

    start = start.replace(/\s/g, "+");

    var URL = GOOGLE_DISTANCE_MATIRIX_URL + '&origins=' + start + '&destinations=' + end + GOOGLE_DISTANCE_MATRIX_KEY;


    request(URL, function (err, httpResponse, body) {
        res.json(body);
    });

});

module.exports = router;

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.json("Unauthorized");
}



