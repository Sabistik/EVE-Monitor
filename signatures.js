var solarSystem = require('./solar-system.js');
var _ = require('lodash');
var siggy = require('./siggy.js');


RegExp.prototype.execAll = function(string) {
    var match = null;
    var matches = new Array();
    while (match = this.exec(string)) {
        var matchArray = [];
        for (i in match) {
            if (parseInt(i) == i) {
                matchArray.push(match[i]);
            }
        }
        matches.push(matchArray);
    }
    return matches;
};

var socket = null;

function setSocket(obj) {
    socket = obj;
}

function update(text)
{
    var regexp = /([A-Z]+)-[0-9]+	([A-Za-z ]+)	([a-zA-Z ]+|)	([a-zA-Z ]+|)	([0-9,]+%)	([0-9,]+) AU/g
    var signatures = regexp.execAll(text);

    if(signatures.length == 0) {
        return;
    }
    console.log('Signatures found');

    if(_.isNil(solarSystem.getCurrent())) {
        return;
    }

    siggy.sendSignatures(solarSystem.getCurrent().id, text).then(function(){
        console.log('siggi send sig ok');
    });

    var viewSignatureList = [];
    _.forEach(signatures, function(signature) {


        var signalRow = solarSystem.getSignature(signature[1]);
        
        if(_.isUndefined(signalRow)) {

            var newSignature = solarSystem.addSignature(signature);
            newSignature.status = 1; // TODO updejtuje status w db
            viewSignatureList.push(newSignature);
            
        } else {
            if(signalRow.type != signature[3] || signalRow.title != signature[4]) {

                var updatedSignature = solarSystem.updateSignature(signature);
                updatedSignature.status = 2;
                viewSignatureList.push(updatedSignature);

            } else {
                viewSignatureList.push(signalRow);
            }
        }

    });


    var signaturesRows = solarSystem.getSignatures();
    _.forEach(signaturesRows, function(signatureItem) {

        var find = _.find(viewSignatureList, {id: signatureItem.id});
        if(_.isNil(find)) {
            
            viewSignatureList.push({
                id: signatureItem.id,
                nature: signatureItem.nature,
                title: signatureItem.title,
                type: signatureItem.type,
                percent: signatureItem.percent,
                distance: signatureItem.distance,
                status: 3
            });
        }

    });

    socket.emit('signatures:change', viewSignatureList);


    var checkSiggy = false;
    _.forEach(viewSignatureList, function(signatureItem) {

        if(signatureItem.type == '' || signatureItem.title == '') {
            checkSiggy = true;
        }

    });
    if(checkSiggy) {
        siggy.getSignatures(solarSystem.getCurrent().id).then(function(data){
            //console.log(data);
            _.forEach(data, function(item, key) {

                var signature = solarSystem.getSignature(item.sig);
                if(!_.isUndefined(signature)) {
                    signature.type = item.type;
                    signature.title = item.description;

                    _.forEach(viewSignatureList, function(signatureItem) {

                        if(item.sig == signatureItem.id) {
                            signatureItem.type = item.type;
                            signatureItem.title = item.description;
                        }

                    });


                }

            });

            socket.emit('signatures:change', viewSignatureList);
        });
    }


}

module.exports = {
    update: update,
    setSocket: setSocket
};