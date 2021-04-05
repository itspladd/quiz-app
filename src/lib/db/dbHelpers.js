const db = require("./db");

// USING dbHelpers:
// All queries are routed through the query(string, param) function in db.js
// db.query returns rows of data by default, no need to do res.rows

const users = require("./dbUsers");
const quizzes = require("./dbQuizzes");
const sessions = require("./dbSessions");

module.exports = {
  ...users,
  ...quizzes,
  ...sessions
};