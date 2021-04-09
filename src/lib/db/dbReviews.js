const db = require("./db");

module.exports = {
  /**
   * Retrieves all reviews for a given quiz.
   * @param  {Integer} id
   *         The ID of the quiz.
   * @return {Promise<[]>}
   *         A promise to an array of review objects.
   */
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
    console.log;
    return db.query(queryString, queryParams);
  },
  /**
   * Adds a new review into the database.
   * @param  {Object} reviewData
   *         The data about the review to insert.
   * @return {Promise<[]>}
   *         A promise to an array containing the new review.
   */
  addReview: function(reviewData) {
    return db.insert("quiz_reviews", reviewData);
  }
};