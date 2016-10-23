var db = require('./database.js');

var current = null;

function setCurrent(system)
{
    current = system;
}

function getCurrent()
{
    return current;
}


function get(id)
{
     return db.get('systems').find({id: id}).value();
}

function add(id, name)
{
    var timestamp = Math.floor(Date.now() / 1000);
    var newSystem = {id: id, name: name, createdAt: timestamp, signatures: [], dscan: [], local: []};
    db.get('systems').push(newSystem).value();

    return newSystem;
}

function removeSignatureFromCurrent(id) {

    var currentSolarSystemId = getCurrent().id;
    db.get('systems').find({id: currentSolarSystemId}).get('signatures').remove({id: id}).value();
}

function getSignature(id)
{
    return db.get('systems').find({id: getCurrent().id}).get('signatures').find({id: id}).value();
}

function getSignatures()
{
    return db.get('systems').find({id: getCurrent().id}).get('signatures').value();
}

function addSignature(signature) {
    var timestamp = Math.floor(Date.now() / 1000);
    var data = {
        createdAt: timestamp,
        id: signature[1],
        nature: signature[2],
        type: signature[3],
        title: signature[4],
        percent: signature[5],
        distance: signature[6]
    };

    db.get('systems').find({id: getCurrent().id}).get('signatures').push(data).value();

    return data;
}

function updateSignature(signature) {
    var timestamp = Math.floor(Date.now() / 1000);
    var data = {
        updatedAt: timestamp,
        type: signature[3],
        title: signature[4],
        percent: signature[5],
        distance: signature[6]
    };

    db.get('systems').find({id: getCurrent().id}).get('signatures').find({id: signature[1]}).assign(data).value();

    return db.get('systems').find({id: getCurrent().id}).get('signatures').find({id: signature[1]}).cloneDeep().value();
}



module.exports = {
    get: get,
    add: add,
    setCurrent: setCurrent,
    getCurrent: getCurrent,
    getSignature: getSignature,
    addSignature: addSignature,
    updateSignature: updateSignature,
    getSignatures: getSignatures,
    removeSignatureFromCurrent: removeSignatureFromCurrent
};