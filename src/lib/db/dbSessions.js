const db = require("./db");

module.exports = {

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

  addSession: function(sessionData) {
    return db.insert("quiz_sessions", sessionData)
      .then(rows => rows[0]);
  },

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