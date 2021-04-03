const db = require('./db');

db.query('SELECT * FROM users')
.then(rows => console.log(rows));