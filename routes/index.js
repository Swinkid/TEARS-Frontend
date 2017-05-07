var express = require('express');
var passport = require('passport');
var router = express.Router();
var request = require('request');

var backendURL = "http://localhost:3001";

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Login' });
});

router.get('/dashboard', isAuthenticated, function(req, res, next) {
    request.get({url: 'http://localhost:3001/api/system/stats'}, function (err, httpResponse, body) {
        if(!err){
            res.render('user/dashboard', { user : req.user, page_name: 'dashboard', stats: JSON.parse(body) });
        } else {
            res.render('user/dashboard', { user : req.user, page_name: 'dashboard', stats: "" });
        }
    });
});

router.get('/command', isAuthenticated, function(req, res, next) {
   res.render('user/command', { user: req.user, page_name: 'command' });
});

router.get('/heatmap', isAuthenticated, function (req, res, next) {
    if(req.user.jobtitle === 'Manager'){
        res.render('user/report_heatmap', {user: req.user,page_name : 'heatmap'});
    } else {
        res.render('user/unauthorized', {user: req.user, page_name: 'heatmap'});
    }
});

router.get('/users', isAuthenticated, function(req, res, next) {
    if(req.user.jobtitle === 'Manager') {
        request({url: 'http://localhost:3001/api/users/list', qs: {type: req.query.type}}, function (error, response, body) {
            var users = '';

            if (!(body == null)) {
                users = JSON.parse(body);
            }

            if (error || response.statusCode !== 200) {
                users = "";
            }

            res.render('user/users', {user: req.user, page_name: 'users', users: users});

        })
    } else {
        res.render('user/unauthorized', {user: req.user, page_name: 'users'});
    }
});

router.get('/users/delete', isAuthenticated, function (req, res, next) {
    request({url: 'http://localhost:3001/api/users/delete', qs: {id : req.query.id, author: req.user.firstname + ' ' + req.user.lastname}}, function (err, httpResponse, body) {
        res.redirect('/users');
    });
});

router.get('/users/add', isAuthenticated, function (req, res, next) {
    res.render('user/users/add_user', {user: req.user, page_name: 'users'});
});

router.post('/users/add', isAuthenticated, function (req, res, next) {
    var formData = {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        jobtitle: req.body.jobtitle,
        author: req.user.firstname + ' ' + req.user.lastname
    };

    request.post({url: 'http://localhost:3001/api/users/add', form: formData}, function (err, httpResponse, body) {
        switch(body){
            case "\"Internal Server Error\"":
            case "\"Duplicate\"":
                res.redirect('/users/add?error=error');
                break;
            case "\"Completed\"":
                res.redirect('/users');
                break;
            default:
                res.redirect('/users/add?error=error');
                break;
        }
    }).on('error', function(err) {
        res.redirect('/users/add?error=error');
    });
});

router.get('/resources', isAuthenticated, function(req, res, next) {
    request({url: 'http://localhost:3001/api/resource', qs: {type: req.query.type}}, function (error, response, body) {
        var resources = '';

        if(!(body == null)) {
            resources = JSON.parse(body);
        }

        if(error || response.statusCode !== 200){
            resources = "";
        }

        res.render('user/resources/resources', { user: req.user, page_name: 'resources', resources: resources});
    });
});

router.post('/device/add', isAuthenticated, function (req, res, next) {
    var formData = {
        device: req.body.device,
        callsign: req.body.callsign,
        resourceType: req.body.resourceType
    };

    request.post({url: 'http://localhost:3001/api/device/add', form: formData}, function (err, httpResponse, body) {
        switch(body){
            case "\"Internal Server Error\"":
            case "\"Duplicate\"":
                res.redirect('/device/add?error=error');
                break;
            case "\"Update Completed\"":
                res.redirect('/resources');
                break;
            default:
                res.redirect('/device/add?error=error');
                break;
        }
    }).on('error', function(err) {
        res.redirect('/device/add?error=error');
    });
});

router.get('/device/add', isAuthenticated, function (req, res, next) {
    var error = '';

    if(req.query.error){
        error = req.query.error;
    }

    res.render('user/resources/add_resource', {user: req.user, error: error, page_name: 'resources'}) ;
});

router.get('/device/edit', isAuthenticated, function (req,res,next) {
    var error = '';

    if(req.query.error){
        error = req.query.error;
        res.redirect('/resources');
    } else {
        if(req.query.id){
            request.get({url: 'http://localhost:3001/api/device/get', qs: {id: req.query.id}}, function (err, httpResponse, body) {
                switch(body){
                    case "\"Internal Server Error\"":
                    case "\"Error\"":
                        res.redirect('/device/edit?error=error');
                        break;
                    default:
                        res.render('user/resources/edit_resources', {user: req.user, error: error, page_name: 'resources', formResult: JSON.parse(body)});
                        break;
                }
            });
        } else {
            error = 'error';
            res.redirect('/resources');
        }
    }
});

router.post('/device/edit', isAuthenticated, function (req, res, next) {
    var formData = {
        id: req.body.id,
        device: req.body.device,
        callsign: req.body.callsign,
        resourceType: req.body.resourceType,
        status: req.body.status,
        author: req.user.firstname + ' ' + req.user.lastname
    };

    request.post({url: 'http://localhost:3001/api/device/update', form: formData}, function (err, httpResponse, body) {
        switch(body){
            case "\"Internal Server Error\"":
            case "\"Duplicate\"":
                res.redirect('/resources?error=error');
                break;
            case "\"Update Completed\"":
                res.redirect('/resources');
                break;
            default:
                res.redirect('/resources?error=error');
                break;
        }
    }).on('error', function(err) {
        res.redirect('/resources?error=error');
    });
});

router.get('/device/delete', isAuthenticated, function (req, res, next) {
    var id = req.query.id;

   request({url: 'http://localhost:3001/api/device/delete', qs: {id : id, author: req.user.firstname + ' ' + req.user.lastname}}, function (err, httpResponse, body) {
       res.redirect('/resources');
   });
});

router.get('/incidents', isAuthenticated, function(req, res, next) {
    request({
        url: backendURL + '/api/incident/all',
        qs : req.query,
        json: true
    }, function (error, response, body) {
            var incidents = '';

            if(body){
                incidents = body;
            }

            res.render('user/incidents/incidents', {user: req.user, page_name: 'incidents', incidents: incidents});
    });
});

router.get('/incidents/delete', isAuthenticated, function (req, res, next) {
    var id = req.query.id;

    request({url: 'http://localhost:3001/api/incident/delete', qs: {id : id, author: req.user.firstname + ' ' + req.user.lastname}}, function (err, httpResponse, body) {
        res.redirect('/incidents');
    });
});

router.get('/incident/close', isAuthenticated, function (req, res, next) {
    var id = req.query.id;

    request({url: 'http://localhost:3001/api/incident/close', qs: {id : id, author: req.user.firstname + ' ' + req.user.lastname}}, function (err, httpResponse, body) {
        res.redirect('/incidents');
    });
});

router.get('/incident/edit', isAuthenticated, function (req,res,next) {
    var error = '';

    if(req.query.error){
        error = req.query.error;
        res.redirect('/incidents');
    } else {
        if(req.query.id){
            request.get({url: 'http://localhost:3001/api/incident', qs: {id: req.query.id}}, function (err, httpResponse, body) {
                switch(body){
                    case "\"Internal Server Error\"":
                    case "\"Error\"":
                        res.redirect('/incidents/edit?error=error');
                        break;
                    default:
                        res.render('user/incidents/edit_incidents', {user: req.user, error: error, page_name: 'incidents', formResult: JSON.parse(body)});
                        break;
                }
            });
        } else {
            error = 'error';
            res.redirect('/incidents');
        }
    }
});

router.post('/incident/edit', isAuthenticated, function (req, res, next) {
    var formData = {
        id: req.body.iid,
        location: req.body.ilocation,
        type : req.body.itype,
        status: req.body.istatus,
        priority : req.body.selectbasic,
        details : req.body.idetails,
        author: req.user.firstname + ' ' + req.user.lastname
    };

    request.post({url: 'http://localhost:3001/api/incident/update', form: formData}, function (err, httpResponse, body) {
        switch(body){
            case "\"Internal Server Error\"":
            case "\"Duplicate\"":
                res.redirect('/incidents?error=error');
                break;
            case "\"Update Completed\"":
                res.redirect('/incidents');
                break;
            default:
                res.redirect('/incidents?error=error');
                break;
        }
    }).on('error', function(err) {
        res.redirect('/incidents?error=error');
    });
});

router.get('/audit', isAuthenticated, function (req, res, next) {
    if(req.user.jobtitle === 'Manager') {
        request({url: 'http://localhost:3001/api/auditlog'}, function (err, httpResponse, body) {
            var audit = "Error";

            if (body !== undefined) {
                switch (body) {
                    case "\"Internal Server Error\"":
                        audit = [];
                        break;
                    default:
                        audit = body;
                        break;

                }
            }

            if(!err){
                res.render('user/audit', {user: req.user, page_name: 'audit', data: JSON.parse(audit)});
            } else {
                res.render('user/audit', {user: req.user, page_name: 'audit', data: ""});
            }

        });
    } else {
        res.render('user/unauthorized', {user: req.user, page_name: 'audit'});
    }
});

router.post('/', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.render('index', { message: info.message, title: 'Login' })
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});

router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
