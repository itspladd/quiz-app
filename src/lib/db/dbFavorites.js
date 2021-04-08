const { query } = require("./db");
const db = require("./db");

module.exports = {
  
  /**
   * Add a new entry to the 'favorites' table.
   * @param  {Object} favoriteData
   *         Must contain { user_id, quiz_id }
   * @return {Object}
   *         A promise to the new favorite as an object.
   *
   */
  addFavorite: function(favoriteData) {
    return db.insert("favorites", favoriteData);
  },

  /**
   * Delete an entry from the 'favorites' table, given the user and the quiz they wish to un-favorite.
   * @param  {Object} favoriteData
   *         Must contain { user_id, quiz_id }
   * @return {Object}
   *         A promise to the deleted favorite as an object.
   *
   */
  deleteFavorite: function(favoriteData) {
    const queryString = `
      DELETE 
      FROM favorites
      WHERE user_id = $1
        AND quiz_id = $2
      RETURNING *
    `;
    const { user_id, quiz_id } = favoriteData;
    const queryParams = [user_id, quiz_id];
    return db.query(queryString, queryParams);
  },

  /**
   * Check to see if an entry matching the given user_id and quiz_id exists in the 'favorites' table.
   * @param  {Object} favoriteData
   *         Must contain { user_id, quiz_id }
   * @return {[Object]}
   *         A promise to the favorite as an object.
   *
   */
  isQuizFavoritedByUser: function(user_id, quiz_id) {
    const queryString = `
      SELECT * FROM favorites
      WHERE user_id = $1
        AND quiz_id = $2
    `;
    const queryParams = [user_id, quiz_id];
    return db.query(queryString, queryParams);
  },

  /**
   * Retrieve all of a user's favorited quizzes from the database.
   * @param  {Object} favoriteData
   *         Must contain { user_id, quiz_id }
   * @return {[Object]}
   *         A promise to an arrayof objects containing quiz data, including cover photo URLS.
   *
   */
  getFavoritesForUser: function(user_id) {
    const queryString = `
      SELECT quizzes.*,
        categories.title AS category_title,
          (CASE
            WHEN quizzes.coverphoto_url IS NULL
            THEN categories.coverphoto_url END)
        AS coverphoto_url
      FROM quizzes
        JOIN categories ON category_id = categories.id
        JOIN favorites ON favorites.quiz_id = quizzes.id
      WHERE favorites.user_id = $1
    `;
    const queryParams = [user_id];
    return db.query(queryString, queryParams);
  }
}