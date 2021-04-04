const bcrypt = require("bcrypt");
const db = require("./db");

const { Pool } = require("pg");

const pool = new Pool({
  user: "ahhreggi",
  password: "123",
  port: "5432",
  host: "localhost",
  database: "midterm"
});

//////////////////////////////////////////////////////////

/**
 * Returns a user from the database with the given username.
 * @param  {string} username
 *         The username of a user.
 * @return {Promise<{}>}
 *         A promise to the user.
 */
const getUserByUsername = (username) => {
  const queryString = `
    SELECT *
    FROM users
    WHERE username = $1
  `;
  const queryParams = [username];
  return pool.query(queryString, queryParams)
    .then(res => res.rows[0]);
};

/**
 * Returns a user from the database with the given email.
 * @param  {string} email
 *         The email of a user.
 * @return {Promise<{}>}
 *         A promise to the user.
 */
const getUserByEmail = (email) => {
  const queryString = `
    SELECT *
    FROM users
    WHERE email = $1
  `;
  const queryParams = [email];
  return pool.query(queryString, queryParams)
    .then(res => res.rows[0]);
};

/**
 * Returns an object containing a user's credentials from database given a username/email.
 * @param  {string} login
 *         The username/email to look up in the database.
 * @param  {{Object.<id: string, username: string, email: string, password: string}} userDB
 *         An object containing user IDs and the corresponding user credentials.
 * @return {{id: string, email: string, password: string}|undefined}
 *         An object containing a single user's credentials or undefined if none was found.
 */
const getUserData = (login, userDB) => {
  const userData = Object.values(userDB).find((user) => {
    return user.username === login || user.email === login;
  });
  return userData;
};

/**
 * Returns the user's data if the given username/email and password combination exists in the database, false otherwise.
 * @param  {string} login
 *         The username/email to look up in the database.
 * @param  {string} password
 *         The password to authenticate credentials with.
 * @param  {{Object.<id: string, username: string, email: string, password: string}} userDB
 *         An object containing user IDs and the corresponding user credentials.
 * @return {{id: string, email: string, password: string}|boolean}
 *         An object containing a single user's credentials or false if none was found.
 */
const authenticateUser = (login, password, userDB) => {
  let userData = getUserData(login, userDB);
  // Given a valid login, check if the password matches the hashed password
  const valid = userData ? bcrypt.compareSync(password, userData.password) : false;
  return valid ? userData : false;
};

module.exports = {
  getUserByUsername,
  getUserByEmail,
  getUserData,
  authenticateUser
};