const db = require("../db");

module.exports = {

  /**
   * Get a single user from the database given their ID.
   * @param {Integer} id The email of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  getUserByID: function(id) {
    const queryString = `SELECT *
      FROM users
      WHERE id = $1`;
    const queryParams = [id];
    return db.query(queryString, queryParams)
    .catch(err => console.error(err));
  },

  /**
   * Get a single user from the database given their username.
   * @param {String} username The username of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  getUserByUsername: function(username) {
    const queryString = `SELECT *
      FROM users
      WHERE username = $1`;
    const queryParams = [username];
    return db.query(queryString, queryParams)
    .catch(err => console.error(err));
  }
};