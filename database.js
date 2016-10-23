var low = require('lowdb');
const db = low('db.json');
db.defaults({ systems: []}).value();


module.exports = db;