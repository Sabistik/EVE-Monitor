var db = require('./database.js');
var request = require('request-promise');
const querystring = require('querystring');
var _ = require('lodash');
var config = require('./config.js');


db.defaults({ auth: {
    access_token: null,
    refresh_token: null,
    clientId: config.api.clientId,
    secretKey: config.api.secretKey
}}).value();


function authorize(code) {

    var auth = db.get('auth').value();

    var authHeader = new Buffer(auth.clientId+':'+auth.secretKey).toString('base64');

    return request.post({
        url: 'https://login.eveonline.com/oauth/token',
        json: true,
        headers: {'Authorization': 'Basic ' + authHeader, 'Content-Type': 'application/json'},
        body: {grant_type: 'authorization_code', code: code},
        resolveWithFullResponse: true
    }).then(function(response) {

        auth.access_token = response.body.access_token;
        auth.refresh_token = response.body.refresh_token
    }, function(response) {
        console.log('Authorize fail');

    });

}

function getAuthorizationUrl() {
    var auth = db.get('auth').value();

    var url = 'https://login.eveonline.com/oauth/authorize';

    var params = {
        'response_type': 'code',
        'redirect_uri': 'http://localhost:3000/authorized',
        'client_id': auth.clientId,
        'scope': 'characterLocationRead',
        'state': 'qwerty123'
    };

    return url + '?' + querystring.stringify(params);
}

function isAuthorized() {
    var auth = db.get('auth').value();

    if(auth.access_token) {
        return true;
    }

    return false;
}

function getLocation() {
    var auth = db.get('auth').value();

    var options = {
        url: 'https://crest-tq.eveonline.com/characters/516717740/location/',
        headers: {
            'Authorization': 'Bearer ' + auth.access_token
        },
        resolveWithFullResponse: true,
        json: true
    };

    return request.get(options).then(function(response) {

        //return {solarSystem: {id: 31001338}}; // for dev work

        return response.body;

    }, function(data) {
        console.log('get location error');
        console.log('HTTP error response code: '+data.response.statusCode);

        if(!_.isUndefined(data.response.body.key) && data.response.body.key == 'authNeeded') {

            return refreshToken().then(function() {
                return getLocation();
            });

        }
    });
};

function refreshToken() {
    var auth = db.get('auth').value();

    console.log('Refreshing token...');

    var authHeader = new Buffer(auth.clientId+':'+auth.secretKey).toString('base64');
    var options = {
        url: 'https://login.eveonline.com/oauth/token',
        json: true,
        headers: {'Authorization': 'Basic '+authHeader, 'Content-Type': 'application/json'},
        body: {grant_type: 'refresh_token', refresh_token: auth.refresh_token},
        resolveWithFullResponse: true,
    };

    return request.post(options).then(function(response) {
        if(!_.isUndefined(response.body.access_token)) {
            auth.access_token = response.body.access_token;
            auth.refresh_token = response.body.refresh_token;

            console.log('Token refreshed successful');

            return;
        } else {
            console.log('Refreshing token error!');
            console.log('HTTP response code: '+httpResponse.statusCode);
            console.log(body);

            return; // promis reject?
        }
    });

}


module.exports = {
    getLocation: getLocation,
    isAuthorized: isAuthorized,
    getAuthorizationUrl: getAuthorizationUrl,
    authorize: authorize
};
