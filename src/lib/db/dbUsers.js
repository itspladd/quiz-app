const db = require("./db");

module.exports = {

  /**
   * Returns a user from the database with the given username.
   * @param  {string} username
   *         The username of a user.
   * @return {Promise<{}>}
   *         A promise to the user.
   */
  getUserByUsername: (username) => {
    const queryString = `
      SELECT *
      FROM users
      WHERE username = $1
    `;
    const queryParams = [username];
    return db.query(queryString, queryParams)
      .then(rows => rows[0]);
  },

  /**
   * Returns a user from the database with the given email.
   * @param  {string} email
   *         The email of a user.
   * @return {Promise<{}>}
   *         A promise to the user.
   */
  getUserByEmail: (email) => {
    const queryString = `
      SELECT *
      FROM users
      WHERE email = $1
    `;
    const queryParams = [email];
    return db.query(queryString, queryParams)
      .then(rows => rows[0]);
  },

  /**
   * Returns a user if the given username/email and password combination exists in the database, false otherwise.
   * @param  {string} login
   *         The username/email of a user.
   * @return {Promise<{}>}
   *         A promise to the user.
   */
  getUserByLogin: (login) => {
    const queryString = `
      SELECT *
      FROM users
      WHERE username = $1 OR email = $1
    `;
    const queryParams = [login];
    return db.query(queryString, queryParams)
      .then(rows => rows[0]);
  },

  /**
   * Returns a user with the given ID.
   * @param  {string} id
   *         The id of a user.
   * @return {Promise<{}>}
   *         A promise to the user.
   */
  getUserByID: (id) => {
    const queryString = `
      SELECT *
      FROM users
      WHERE id = $1
    `;
    const queryParams = [id];
    return db.query(queryString, queryParams)
      .then(rows => rows[0]);
  },

  /**
   * Adds a new user to the database.
   * @param  {{username: string, email: string, password: string}} user
   *         The user data to be added.
   * @return {Promise<{}>}
   *         A promise to the user.
   */
  addUser: (userData) => {
    // Extract the user data into queryParams and the keys into an array
    return db.insert("users", userData)
      .then(rows => rows[0]);
  }

};