var express = require('express');
var router = express.Router();

var api = require('./api.js');
var watcher = require('./watcher.js');



router.get('/', function (req, res) {

    if(api.isAuthorized()) {
        res.sendFile(__dirname + '/index.html');

        watcher.location();

    } else {
        res.redirect(api.getAuthorizationUrl());
    }

});


router.get('/authorized', function(req, res) {

    api.authorize(req.query.code).then(function() {
        res.redirect('/');
    });
    
});

/*router.get('/user', function(req, res) {

    request.get({
            url: 'https://login.eveonline.com/oauth/verify',
            headers: {'Authorization': 'Bearer '+ access_token},
            json: true
        },
        function(err, httpResponse, body) {
            res.json(body);
        });
});*/

module.exports = router;