const db = require("./db");

module.exports = {
  addSession: function(sessionData) {
    const {columns, vars, queryParams} = db.buildInsertQueryParams(sessionData);
    const queryString = `
      INSERT INTO quiz_sessions (${columns})
      VALUES (${vars})
      RETURNING *;
    `;
    return db.query(queryString, queryParams)
      .then(rows => rows[0]);
  },
};