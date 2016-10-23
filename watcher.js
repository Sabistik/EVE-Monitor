var api = require('./api.js');
var solarSystem = require('./solar-system.js');
var _ = require('lodash');


var socket;

function setSocket(obj) {
    socket = obj;
}

function location() {

    api.getLocation().then(function (data) {

        
        if (!_.isUndefined(data.solarSystem)) {
            console.log('Received Solar system: ' + data.solarSystem.id);
            //solarSystem.setCurrentId(data.solarSystem.id);

            var system = solarSystem.get(data.solarSystem.id);

            if(_.isUndefined(system)) {

                var newSystem = solarSystem.add(data.solarSystem.id, data.solarSystem.name);

                solarSystem.setCurrent(newSystem);

                socket.emit('system:change', newSystem);

            } else {
                var currentSystem = solarSystem.getCurrent();
                if(_.isNil(currentSystem) || data.solarSystem.id != currentSystem.id) {
                    solarSystem.setCurrent(system);
                    socket.emit('system:change', system);
                }
            }
        } else {
            console.log('No solar system');
        }

        setTimeout(function () {
            location();
        }, 3000);
    });
}


module.exports = {
    location: location,
    setSocket: setSocket
};