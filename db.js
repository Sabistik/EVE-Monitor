var _ = require('lodash');
var low = require('lowdb');
const db = low('db.json');
db.defaults({ systems: []}).value();

var systemRow = db.get('systems').find({id: 12345}).value();


//console.log(_.isUndefined(systemRow));

if(_.isUndefined(systemRow)) {
  db.get('systems').push({id: 12345, signatures: [], dscan: [], local: []}).value();
}


var systemRow = db.get('systems').find({id: 12345});

var signalRow = systemRow.get('signatures').find({id: 'abc-123'}).value();

if(_.isUndefined(signalRow)) {
  var ret = systemRow.get('signatures').push({id: 'abc-123', title: 'testowa sygnatura'}).value();
  
} else {
  systemRow.get('signatures').find({id: 'abc-123'}).assign({ title: 'hi!'}).value();

}
