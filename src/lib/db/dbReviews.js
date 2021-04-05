const db = require("./db");

module.exports = {
  getReviewsByQuizId: function(id) {
    const queryString = `
      SELECT reviews.*, users.username
      FROM quiz_reviews AS reviews
        JOIN users ON users.id = reviews.user_id
      WHERE quiz_id = $1
      ORDER BY created_at DESC;
    `;
    const queryParams = [id];
    return db.query(queryString, queryParams);
  },
}