const db = require("../db");

module.exports = {
  getUserByID: function(id) {
    const queryString = `SELECT *
      FROM users
      WHERE id = $1`;
    const queryParams = [id];
    return db.query(queryString, queryParams)
    .catch(err => console.error(err));
  },

  getUserByUsername: function(username) {
    const queryString = `SELECT *
      FROM users
      WHERE username = $1`;
    const queryParams = [username];
    return db.query(queryString, queryParams)
    .catch(err => console.error(err));
  }
};