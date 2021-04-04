const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // /quizzes
  router.get("/", (req, res) => {
    // Browse all
    const quizData = [
      { id: "1", title: "Quiz Name", description: "This is the description."},
      { id: "2", title: "Quiz Name", description: "This is the description."},
      { id: "3", title: "Quiz Name", description: "This is the description."},
      { id: "3", title: "Quiz Name", description: "This is the description."},
      { id: "3", title: "Quiz Name", description: "This is the description."},
      { id: "3", title: "Quiz Name", description: "This is the description."},
      { id: "3", title: "Quiz Name", description: "This is the description."},
      { id: "3", title: "Quiz Name", description: "This is the description."},
      { id: "3", title: "Quiz Name", description: "This is the description."},
      { id: "3", title: "Quiz Name", description: "This is the description."},
      { id: "3", title: "Quiz Name", description: "This is the description."},
    ]
    const {
      alerts,
      userData,
      currentPage
    } = res.locals.vars;
    const templateVars = {
      alerts,
      userData,
      currentPage,
      quizData
    };
    res.render("quiz_index", templateVars);
  });

  // /quizzes/new
  router.get("/new", (req, res) => {
    const {
      alerts,
      userData,
      currentPage
    } = res.locals.vars;
    const templateVars = {
      alerts,
      userData,
      currentPage
    };
    res.render("quiz_new", templateVars);
  });

  // /quizzes/:quizID --> generates a session and results/:sessionID on the client-side
  router.get("/:quizID", (req, res) => {
    const {
      alerts,
      userData,
      currentPage
    } = res.locals.vars;
    const templateVars = {
      alerts,
      userData,
      currentPage
    };
    // db.query("SELECT...")
    //   .then()
    //   .catch();
    res.render("quiz_show", templateVars);
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
};