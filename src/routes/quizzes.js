const express = require("express");
const router = express.Router();

module.exports = (db) => {
  
  // /quizzes
  router.get("/", (req, res) => {
    db.query(`SELECT...`)
      .then()
      .catch();
    res.render("quiz_index");
  });

  // /quizzes/new
  router.get("/new", (req, res) => {
    res.render("quiz_new");
  });

  // /quizzes/:quizID --> generates a session and results/:sessionID on the client-side
  router.get("/:quizID", (req, res) => {
    db.query(`SELECT...`)
    .then()
    .catch();
    res.render("quiz_show");
  });

  router.post("/", (req, res) => {
    // POST STUFF
    // REDIRECT TO /:quizID
  });

/*STRETCH: global results from this quiz
    router.get("/:quizID/results", (req, res) => {
    res.render("quiz_results");
  });
 */

  return router;
}