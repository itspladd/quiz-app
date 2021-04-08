const db = require("./db");

// Using dbHelpers:
// All queries are routed through the query() function in db.js
// db.query returns rows of data by default, no need to do res.rows
// All database-accessing functions must be defined in a /dbCategory.js file
// All dbCategory files must be specified here and then expanded into module.exports for use in routes

const users = require("./dbUsers");
const quizzes = require("./dbQuizzes");
const sessions = require("./dbSessions");
const reviews = require("./dbReviews");
const results = require("./dbResults");
const favorites = require("./dbFavorites");

module.exports = {
  ...db,
  ...users,
  ...quizzes,
  ...sessions,
  ...reviews,
  ...results,
  ...favorites
};