var request = require('request-promise');
var config = require('./config.js');

var FileCookieStore = require('tough-cookie-filestore');
// NOTE - currently the 'cookies.json' file must already exist!
var j = request.jar(new FileCookieStore('cookies.json'));
request = request.defaults({ jar : j })


function login() {

    console.log('Loging...');
    return request({
        url: 'https://siggy.borkedlabs.com/account/login',
        method: 'POST',
        form: {
            username: config.siggy.username,
            password: config.siggy.password,
            rememberMe: 'on'
        },
        resolveWithFullResponse: true
    }).then(function (response) {
        alert('login ok?')
    }, function(data) {

        if(data.response.headers.location != 'https://siggy.borkedlabs.com/') {
            console.log('Siggy login error!');
        } else {
            console.log('Login successful');
        }
    });

};

function getSignatures(systemId)
{
    console.log('getting signatures from siggy');
    var timestamp = Math.floor(Date.now() / 1000);

    var options = {
        url: 'https://siggy.borkedlabs.com/siggy/siggy',
        method: 'POST',
        form: {
            forceUpdate: true,
            mapOpen: true,
            lastUpdate: timestamp,
            mapLastUpdate: timestamp,
            systemID: systemId
        },
        json: true,
        resolveWithFullResponse: true
    };
    return request(options).then(function(response) {

        return response.body.sigData;

    }, function(response){

        if(response.statusCode == 302) {
            console.log('getSignature login need!');
            return login().then(
                function() {
                    return getSignatures(systemId);
                }
            );

        } else {
            console.log('Siggy get signatures error!');
        }

    });


}

function sendSignatures(systemId, text)
{
    return request({
        url: 'https://siggy.borkedlabs.com/sig/mass_add',
        method: 'POST',
        form: {
            blob: text,
            systemID: systemId,
        },
        resolveWithFullResponse: true
    }).then(function(response) {
        console.log('Siggy addSignatures success');
        //console.log(response.body);
    }, function(){
        console.log('Siggy addSignatures fail');
    });
}



module.exports = {
    getSignatures: getSignatures,
    sendSignatures: sendSignatures
};

