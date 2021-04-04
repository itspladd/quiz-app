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
 * Returns a user if the given username/email and password combination exists in the database, false otherwise.
 * @param  {string} login
 *         The username/email of a user.
 * @param  {string} password
 *         The password to authenticate credentials with.
 * @return {Promise<{}>}
 *         A promise to the user.
 */
const getUserByLogin = (login) => {
  const queryString = `
    SELECT *
    FROM users
    WHERE username = $1 OR email = $1
  `;
  const queryParams = [login];
  return pool.query(queryString, queryParams)
    .then(res => res.rows[0]);
};

/**
 * Returns a user with the given ID.
 * @param  {string} id
 *         The id of a user.
 * @return {Promise<{}>}
 *         A promise to the user.
 */
const getUserByID = (id) => {
  const queryString = `
    SELECT *
    FROM users
    WHERE id = $1
  `;
  const queryParams = [id];
  return pool.query(queryString, queryParams)
    .then(res => res.rows[0]);
};

module.exports = {
  getUserByUsername,
  getUserByEmail,
  getUserByLogin,
  getUserByID
};