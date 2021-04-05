const db = require("./db");

module.exports = {
  getRatingsByQuizId: function(id) {
    const queryString = `
      SELECT ratings.*, users.username
      FROM quiz_ratings AS ratings
        JOIN users ON users.id = ratings.user_id
      WHERE quiz_id = $1;
    `;
    const queryParams = [id];
    return db.query(queryString, queryParams);
  },
}