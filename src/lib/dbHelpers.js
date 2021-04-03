const db = require("./db");

// USING dbHelpers:
// All queries are routed through the query(string, param) function in db.js
// db.query returns rows of data by default, no need to do res.rows

const users = require("./dbHelpers/dbHelperUsers");
const quizzes = require("./dbHelpers/dbHelperQuizzes");
const sessions = require("./dbHelpers/dbHelperSessions");

module.exports = { 
  ...users,
};