const db = require("./db");

module.exports = {
  /**
   * Retrieves all quiz_sessions for the given user, ordered by when the quiz was started.
   * @param  {Integer} user_id
   *         The ID of the user.
   * @return {Promise<[]>}
   *         A promise to an array containing the sessions, including:
   *          - The ID of the results page if there is an associated entry in the 'results' table
   *          - The title of the quiz for that session
   *          - The URL of the cover photo (defaults to the category cover photo if none specified for that quiz) 
   *          - The time when the session was completed (NULL if the quiz was never submitted)
   *          
   */
  getSessionsByUser: function(user_id) {
    const queryString = `
      SELECT 
        results.id AS result_id,
        quizzes.title AS quiz_title,
          (CASE
            WHEN quizzes.coverphoto_url IS NULL
            THEN categories.coverphoto_url END)
        AS coverphoto_url,
        end_time
      FROM quiz_sessions AS sessions
        LEFT OUTER JOIN results ON session_id = sessions.id
        JOIN quizzes ON sessions.quiz_id = quizzes.id
        JOIN categories ON quizzes.category_id = categories.id
      WHERE user_id = $1
      ORDER BY start_time DESC
    `;
    const queryParams = [user_id];
    return db.query(queryString, queryParams);
  },

  /**
   * Adds a new quiz_session into the database.
   * @param  {Object} sessionData
   *         The data about the quiz_session to insert.
   * @return {Promise<[]>}
   *         A promise to an array containing the new quiz_session.
   */
  addSession: function(sessionData) {
    return db.insert("quiz_sessions", sessionData);
  },

  /**
   * Updates a quiz_session's end time.
   * @param  {Integer} session_id
   *         The ID of the session to update.
   * @return {Promise<[]>}
   *         A promise to an empty array.
   */
  markSessionEndTime: function(session_id) {
    const queryString = `
      UPDATE quiz_sessions
      SET end_time = NOW()
      WHERE id = $1
    `;
    const queryParams = [session_id];
    return db.query(queryString, queryParams);
  }

};