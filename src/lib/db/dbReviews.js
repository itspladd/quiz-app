const db = require("./db");

module.exports = {

  getReviewsByQuizId: function(id) {
    const queryString = `
      SELECT reviews.*,
        users.username,
        users.is_admin,
        CONCAT('${db.AVATAR_PATH}', users.avatar_id, '${db.AVATAR_FILETYPE}') AS avatar_url
      FROM quiz_reviews AS reviews
        JOIN users ON users.id = reviews.user_id
      WHERE quiz_id = $1
      ORDER BY created_at DESC;
    `;
    const queryParams = [id];
    console.log
    return db.query(queryString, queryParams);
  },

  addReview: function(reviewData) {
    return db.insert("quiz_reviews", reviewData);
  }
};