var express = require('express');
var passport = require('passport');
var router = express.Router();
var Config = require('../config');
var http = require('http');

router.get('/resources', isAuthenticated, function(req, res, next) {
    var requestOptions = {
        host : Config.backend,
        port : Config.backendPort,
        path : '/frontend/resource',
        method : 'GET'
    };

    var requestResources = http.request(requestOptions, function(result){
        result.on('data', function (data) {
            data = data.toString();


            parsedData = JSON.parse(data);

            if(parsedData['lastUpdated'] > new Date().getMilliseconds()){
                parsedData['timeDifference'] = new Date((parsedData['lastUpdated'] - new Date().getMilliseconds()));
            } else {
                parsedData['timeDifference'] = new Date(new Date().getMilliseconds() - parsedData['lastUpdated']);
            }

            console.log(parsedData['timeDifference']);

            res.json(parsedData);
        });

        req.on('error', function(e) {
            res.json("Error");
        });
    });

    requestResources.end();

    requestResources.on('error', function(e) {
        res.json("Error");
    });
});

module.exports = router;

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.json("Unauthorized");
}



