const db = require("./db");

// USING dbHelpers:
// All queries are routed through the query(string, param) function in db.js
// db.query returns rows of data by default, no need to do res.rows

module.exports = { 
  getUserById: function(id) {
    const queryString = `SELECT *
      FROM users
      WHERE id = $1`;
    const queryParams = [id];
    return db.query(queryString, queryParams)
    .catch(err => console.error(err));
  }
};