var clipboard = require("./clipboard.js");



var app = require('express')();
var http = require('http').Server(app);
var socket = require('socket.io')(http);
var InfiniteLoop = require('infinite-loop');

var routes = require('./routes.js');


var api = require('./api.js');

var solarSystem = require('./solar-system.js');

var signatures = require('./signatures.js');
signatures.setSocket(socket);

var watcher = require('./watcher.js');
watcher.setSocket(socket);


app.use('/', routes);

http.listen(3000, function(){
    console.log('listening on *:3000');
});


socket.on('connection', function(socket) {
    
    socket.on('system:get', function(data, response) {
        var system = solarSystem.getCurrent();
        response(system);
    });

    socket.on('signature:remove', function(signature, response) {
        solarSystem.removeSignatureFromCurrent(signature.id);
        response(true);
    });

});


var il = new InfiniteLoop();
il.add(function() {
    clipboard.monitor(function(newTextClipboard) {
        console.log('New clipboard.');
        signatures.update(newTextClipboard);
    });
}).run();

