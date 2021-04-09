/* eslint-disable */

const db = require("./db");
const fs = require("fs");

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
    return db.query(queryString, queryParams);
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
    return db.query(queryString, queryParams);
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
    return db.query(queryString, queryParams);
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
      SELECT *,
        CONCAT('${db.AVATAR_PATH}', users.avatar_id, '${db.AVATAR_FILETYPE}') AS avatar_url
      FROM users
      WHERE id = $1
    `;
    const queryParams = [id];
    return db.query(queryString, queryParams);
  },

  /**
   * Adds a new user to the database.
   * @param  {{username: string, email: string, password: string}} user
   *         The user data to be added.
   * @return {Promise<{}>}
   *         A promise to the user.
   */
  addUser: (userData) => {
    // Generate random avatar
    numAvatars = fs.readdirSync(`./public${db.AVATAR_PATH}`).length - 1;
    userData.avatar_id = Math.floor(Math.random() * numAvatars) + 1;
    // Extract the user data into queryParams and the keys into an array
    return db.insert("users", userData);
  },

  /**
   * Changes a user's avatar.
   * @param  {Integer} user_id
   *         The ID of the user.
   * @param  {Integer} avatar_id
   *         The ID of the new avatar.
   * @return {Promise<[]>}
   *         A promise to an empty array.
   */
  updateUserAvatar: (user_id, avatar_id) => {
    const queryString = `
      UPDATE users
      SET avatar_id = $1
      WHERE id = $2;
    `;
    const queryParams = [avatar_id, user_id];
    return db.query(queryString, queryParams);
  },

  // DELETE A USER FOREVER. DANGER DANGER.
  /**
   * Deletes a user from the 'users' table.
   * @param  {Integer} user_id
   *         The ID of the user to delete.
   * @return {Promise<[]>}
   *         A promise to an array containing the deleted user's data.
   */
  deleteUserByID: (user_id) => {
    const queryString = `
      DELETE
      FROM users
      WHERE id = $1
      RETURNING *
    `;
    const queryParams = [user_id];
    return db.query(queryString, queryParams);
  },
};