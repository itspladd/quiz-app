const { query } = require("./db");
const db = require("./db");

module.exports = {
  addFavorite: function(favoriteData) {
    return db.insert("favorites", favoriteData);
  },

  deleteFavorite: function(favoriteData) {
    const queryString = `
      DELETE 
      FROM favorites
      WHERE quiz_id = $1
        AND user_id = $2
      RETURNING quiz_id
    `;
    const { user_id, quiz_id } = favoriteData;
    const queryParams = [user_id, quiz_id];
    return db.query(queryString, queryParams);
  },

  isQuizFavoritedByUser: function(user_id, quiz_id) {
    const queryString = `
      SELECT * FROM favorites
      WHERE user_id = $1
        AND quiz_id = $2
    `;
    const queryParams = [user_id, quiz_id];
    return db.query(queryString, queryParams);
  },

  getFavoritesForUser: function(user_id) {
    const queryString = `
      SELECT quizzes.*,
        categories.title AS category_title
      FROM quizzes
        JOIN categories ON category_id = categories.id
        JOIN favorites ON favorites.quiz_id = quizzes.id
      WHERE favorites.user_id = $1
    `;
    const queryParams = [user_id];
    return db.query(queryString, queryParams);
  }
}