const db = require("./db");

module.exports = {
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