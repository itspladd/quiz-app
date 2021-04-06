const db = require("./db");

module.exports = {
  addSession: function(sessionData) {
    return db.insert("quiz_sessions", sessionData)
    .then(rows => rows[0]);
  },
};